const { sequelize, Sequelize } = require("../configs/sequelize");
const Review = require("../review/model");
const { DataTypes, Model } = Sequelize;

class Game extends Model {};

Game.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    launchDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
},{
    sequelize,
    modelName: "games"
});

Review.belongsTo(Game, {foreignKey: "gameId"});

module.exports = Game;