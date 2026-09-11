const User = require('./User');
const Child = require('./Child');
const Growth = require('./Growth');
const Nutrition = require('./Nutrition');
const Donation = require('./Donation');
const Donor = require('./Donor');
const Education = require('./Education');

// Associations
User.hasMany(Child, { foreignKey: 'userId', as: 'children' });
Child.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Child.hasMany(Growth, { foreignKey: 'childId', as: 'growthHistory' });
Growth.belongsTo(Child, { foreignKey: 'childId', as: 'child' });

Donation.hasMany(Donor, { foreignKey: 'donationId', as: 'donors' });
Donor.belongsTo(Donation, { foreignKey: 'donationId', as: 'donation' });

User.hasMany(Donor, { foreignKey: 'userId', as: 'donations' });
Donor.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  Child,
  Growth,
  Nutrition,
  Donation,
  Donor,
  Education,
};
