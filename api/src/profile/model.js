const { sequelize, Sequelize } = require("../configs/sequelize");
const { DataTypes, Model } = Sequelize;

class Profile extends Model {};

Profile.init({
    description: {
        type: DataTypes.STRING
    }
},{
    sequelize,
    modelName: "profiles"
});

module.exports = Profile;