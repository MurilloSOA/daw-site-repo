const { sequelize, Sequelize } = require("../configs/sequelize");
const { DataTypes, Model } = Sequelize;

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


module.exports = Review;