const { sequelize, Sequelize } = require("../configs/sequelize");
const { DataTypes, Model } = Sequelize;

class User extends Model {};

User.init ({
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    sequelize,
    modelName: 'users'
});

module.exports = User;