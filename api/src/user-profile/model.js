const { sequelize, Sequelize } = require("../configs/sequelize");
const { DataTypes, Model } = Sequelize;
const User = require('../user/model');
const Profile = require('../profile/model')

class UserProfile extends Model {};

UserProfile.init({
    userId: {
        type: DataTypes.BIGINT,
        references: {
            model: User,
            key: 'id'
        }
    },
    profileId: {
        type: DataTypes.BIGINT,
        references: {
            model: Profile,
            key: 'id'
        }
    }
},{
    sequelize,
    modelName: userProfiles 
})

User.belongsToMany(Profile, {through: UserProfile});
Profile.belongsToMany(User, {through: UserProfile});

module.exports = UserProfile;