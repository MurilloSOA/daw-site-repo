const { sequelize, Sequelize } = require("../configs/sequelize");
const { DataTypes, Model } = Sequelize;
const User = require('../user/model');
const Game = require('../game/model');

class Review extends Model {};

Review.init({
    score: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    recommendation: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
},{
    sequelize,
    modelName: "reviews"
});

User.belongsToMany(Game, {through: Review});
Game.belongsToMany(User, {through: Review});
module.exports = Review;