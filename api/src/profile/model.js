const { sequelize, Sequelize } = require("../configs/sequelize");
const { DataTypes, Model } = Sequelize;

class Profile extends Model {};

Profile.init({
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    sequelize,
    modelName: "profiles"
});

module.exports = Profile;