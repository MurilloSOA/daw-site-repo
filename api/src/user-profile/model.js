const { sequelize, Sequelize } = require("../configs/sequelize");
const { DataTypes, Model } = Sequelize;
const User = require('../user/model');
const Profile = require('../profile/model')

class UserProfile extends Model {};

UserProfile.init({
},{
    sequelize,
    modelName: 'userProfiles'
})

User.belongsToMany(Profile, {through: UserProfile});
Profile.belongsToMany(User, {through: UserProfile});

module.exports = UserProfile;