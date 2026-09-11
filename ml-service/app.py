from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model_risiko_gizi.pkl')
model_bundle = joblib.load(MODEL_PATH)

kmeans = model_bundle['model']
scaler = model_bundle['scaler']
le_jk = model_bundle['label_encoder_jk']
label_risiko_per_cluster = model_bundle['label_risiko_per_cluster']

print("Model loaded successfully")
print(f"   Features: {model_bundle['fitur']}")
print(f"   K optimal: {model_bundle['k_optimal']}")
print(f"   Labels: {label_risiko_per_cluster}")


@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'OK',
        'message': 'NutriKids ML Service running',
        'model_loaded': True,
    })


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        required = ['gender', 'age', 'weight', 'height']
        for field in required:
            if field not in data:
                return jsonify({
                    'success': False,
                    'message': f'Field {field} wajib diisi',
                }), 400

        gender = str(data['gender']).strip().upper()
        if gender in ['LAKI-LAKI', 'LAKI LAKI', 'L', 'MALE', 'M']:
            gender = 'L'
        elif gender in ['PEREMPUAN', 'P', 'FEMALE', 'F']:
            gender = 'P'
        else:
            return jsonify({
                'success': False,
                'message': 'Gender harus L/P atau Laki-laki/Perempuan',
            }), 400

        age = float(data['age'])
        weight = float(data['weight'])
        height = float(data['height'])

        input_df = pd.DataFrame({
            'JK': [gender],
            'Usia': [age],
            'Berat': [weight],
            'Tinggi': [height],
        })

        input_df['JK'] = le_jk.transform(input_df['JK'])
        input_scaled = scaler.transform(input_df[['JK', 'Usia', 'Berat', 'Tinggi']])

        cluster = int(kmeans.predict(input_scaled)[0])
        label = label_risiko_per_cluster.get(cluster, 'Tidak Diketahui')

        height_m = height / 100
        bmi = round(weight / (height_m ** 2), 2) if height_m > 0 else 0

        recommendations = {
            'Sangat Berisiko Tinggi': [
                'SEGERA konsultasikan ke tenaga kesehatan / dokter anak',
                'Berikan makanan bergizi tinggi kalori dan protein',
                'Pantau berat & tinggi badan setiap minggu',
                'Rujuk ke puskesmas / rumah sakit terdekat',
            ],
            'Berisiko Tinggi': [
                'Konsultasikan ke tenaga kesehatan dalam 1-2 minggu',
                'Tingkatkan asupan protein hewani (telur, ikan, daging)',
                'Berikan makanan tambahan (PMT)',
                'Pantau pertumbuhan setiap 2 minggu',
            ],
            'Risiko Sedang': [
                'Perbaiki pola makan dengan gizi seimbang',
                'Pastikan 3x makan utama + 2x selingan',
                'Konsultasi rutin ke posyandu',
                'Pantau pertumbuhan setiap bulan',
            ],
            'Risiko Rendah': [
                'Pertahankan pola makan sehat dan bergizi',
                'Lanjutkan pemantauan pertumbuhan rutin',
                'Pastikan anak cukup aktivitas fisik',
                'Berikan vitamin dan imunisasi lengkap',
            ],
            'Tidak Berisiko': [
                'Pertahankan pola makan sehat dan bergizi',
                'Lanjutkan pemantauan pertumbuhan rutin',
                'Jaga kebersihan dan sanitasi lingkungan',
                'Berikan stimulasi tumbuh kembang yang cukup',
            ],
        }

        return jsonify({
            'success': True,
            'data': {
                'gender': data['gender'],
                'age': age,
                'weight': weight,
                'height': height,
                'bmi': bmi,
                'cluster': cluster,
                'status_gizi': label,
                'recommendations': recommendations.get(label, []),
            },
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}',
        }), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)
