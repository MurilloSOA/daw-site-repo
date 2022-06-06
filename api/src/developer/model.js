const { sequelize, Sequelize } = require("../configs/sequelize");
const { DataTypes, Model } = Sequelize;
const Game = require('../game/model');

class Developer extends Model {};

Developer.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    sequelize,
    modelName: "developers"
});

Developer.hasMany(Game);
Game.belongsTo(Developer);

module.exports = Developer;