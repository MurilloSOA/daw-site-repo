const { sequelize, Sequelize } = require("../configs/sequelize");
const { DataTypes, Model } = Sequelize;

class Developer extends Model {};

Developer.init({
    name: {
        type: DataTypes.STRING
    }
},{
    sequelize,
    modelName: "developers"
});

module.exports = Developer;