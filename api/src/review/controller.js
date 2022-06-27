const httpStatus = require("http-status");
const { sequelize, Sequelize } = require("../configs/sequelize");
const { Op } = Sequelize;
const Review = require('./model')
const Game = require('../game/model')
const User = require('../user/model')
const auth = require('../core/auth')

let methods = {};

methods = {

    create: async (req,res) => {
        if('userId' in req.body && req.body.userId != ""){
            let regexp = new RegExp(/^\d+$/);
            if(!regexp.test(req.body.userId)){
                return res.status(httpStatus.BAD_REQUEST).json({error: "ID can't contain non-numeric characters"});
            }

            let user = await User.findOne({where: {id: req.body.userId}})

            if(user == null){
                return res.status(httpStatus.NOT_FOUND).json({error: "User with requested ID was not found"});
            }   else {
                if('gameId' in req.body && req.body.gameId != "" && req.body.gameId != undefined){
                    let regexp = new RegExp(/^\d+$/);
                    if(!regexp.test(req.body.gameId)){
                        return res.status(httpStatus.BAD_REQUEST).json({error: "ID can't contain non-numeric characters"});
                    }

                    let game = await Game.findOne({where: {id: req.body.gameId}});

                    if(game == null){
                        return res.status(httpStatus.NOT_FOUND).json({error: "Game with requested ID was not found"});
                    }
                } else{
                    return res.status(httpStatus.BAD_REQUEST).json({error: "Game ID missing from request"});
                }
            }

            let review = await Review.findOne({where: {userId: req.body.userId,gameId: req.body.gameId}})

            if(review != null){
                return res.status(httpStatus.CONFLICT).json({error: "Review from specified User ID of specified Game ID already exists"})
            }
        }   else{
            return res.status(httpStatus.BAD_REQUEST).json({error: "User ID missing from request"});
        }

        if('score' in req.body && req.body.score != ""){
            let regexp = new RegExp(/^[+-]?([0-9]*[.])?[0-9]+$/);
            if(regexp.test(req.body.score)){
                if(req.body.score < 0 || req.body.score > 5.0){
                    return res.status(httpStatus.BAD_REQUEST).json({error: "Score is invalid, must be between 0 and 5.0"});
                }
            }   else {
                return res.status(httpStatus.BAD_REQUEST).json({error: "Score is invalid, can't contain non-numeric characters"});
            }
        }   else{
            return res.status(httpStatus.BAD_REQUEST).json({error: "Score missing from request"});
        }

        if(!('recommendation' in req.body || req.body.recommendation === "")){
            return res.status(httpStatus.BAD_REQUEST).json({error: "Recommendation missing from request, must be true or false"});
        }

        try{
            if('comment' in req.body && req.body.comment != ""){
                let review = await Review.create({
                    userId: req.body.userId,
                    gameId: req.body.gameId,
                    score: req.body.score,
                    comment: req.body.comment,
                    recommendation: req.body.recommendation
                })

                return res.status(httpStatus.CREATED).send(review);
            }   else {
                let review = await Review.create({
                    userId: req.body.userId,
                    gameId: req.body.gameId,
                    score: req.body.score,
                    comment: null,
                    recommendation: req.body.recommendation
                })

                return res.status(httpStatus.CREATED).send(review);
            }
        }
        catch(error){
            if(error.status == httpStatus.UNAUTHORIZED || error.status == httpStatus.FORBIDDEN){
                return res.status(error.status).end(error.message)
            }   else{
                console.log(error);
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: "Internal server error"});
            }
        }
    },
    findReviews: async (req,res) => {
        let hasUserId = ('userId' in req.query && req.query.userId != "") ? true : false;
        let hasGameId = ('gameId' in req.query && req.query.gameId != "") ? true : false;

        try{
            let reviews;
            if(hasUserId){
                if(hasGameId){
                    reviews = await Review.findAll({where: {userId: req.query.userId,gameId: req.query.gameId},include: [Game, User]})
                }   else {
                    reviews = await Review.findAll({where: {userId: req.query.userId}, include: [Game, User]})
                }
            }   else {
                if(hasGameId){
                    reviews = await Review.findAll({where: {gameId: req.query.gameId}, include: [Game, User]})
                }   else {
                    reviews = await Review.findAll({include: [Game, User]});
                }
            }

            if(reviews == null){
                res.set("Info","No reviews were found");
                return res.status(httpStatus.NO_CONTENT).end();
            }
            return res.json(reviews);
        }
        catch(error){
            if(error.status == httpStatus.UNAUTHORIZED || error.status == httpStatus.FORBIDDEN){
                return res.status(error.status).end(error.message)
            }   else{
                console.log(error);
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: "Internal server error"});
            }
        }
    },
    update: async (req,res) => {
        if('userId' in req.body && req.body.userId != ""){
            let regexp = new RegExp(/^\d+$/);
            if(!regexp.test(req.body.userId)){
                return res.status(httpStatus.BAD_REQUEST).json({error: "ID can't contain non-numeric characters"});
            }

            if('gameId' in req.body && req.body.gameId != ""){
                let regexp = new RegExp(/^\d+$/);
                if(!regexp.test(req.body.gameId)){
                    return res.status(httpStatus.BAD_REQUEST).json({error: "ID can't contain non-numeric characters"});
                }
            }   else {
                return res.status(httpStatus.BAD_REQUEST).json({error: "Game ID missing from request"});
            }
        }   else{
            return res.status(httpStatus.BAD_REQUEST).json({error: "User ID missing from request"});
        }

        if('score' in req.body && req.body.score != ""){
            let regexp = new RegExp(/^[+-]?([0-9]*[.])?[0-9]+$/);
            if(regexp.test(req.body.score)){
                if(req.body.score < 0 || req.body.score > 5.0){
                    return res.status(httpStatus.BAD_REQUEST).json({error: "Score is invalid, must be between 0 and 5.0"});
                }
            }   else {
                return res.status(httpStatus.BAD_REQUEST).json({error: "Score is invalid, can't contain non-numeric characters"});
            }
        }

        try{
            

            let review = await Review.findOne({where: {userId: req.body.userId,gameId: req.body.gameId}})

            if(review == null){
                return res.status(httpStatus.NOT_FOUND).json({error: "Review with requested ID was not found"});
            }   else{
                if('score' in req.body && req.body.score != ""){
                    review.score = req.body.score;
                }
                if('comment' in req.body){
                    if(req.body.comment == ""){
                        review.comment = null;
                    }   else{
                        review.comment = req.body.comment;
                    }
                }
                if('recommendation' in req.body && req.body.recommendation != null){
                    review.recommendation = req.body.recommendation;
                }

                let modifiedReview = await review.save();
                return res.send(modifiedReview);
            }
        }
        catch(error){
            if(error.status == httpStatus.UNAUTHORIZED || error.status == httpStatus.FORBIDDEN){
                return res.status(error.status).end(error.message)
            }   else{
                console.log(error);
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: "Internal server error"});
            }
        }
    },
    delete: async (req,res) => {
        if('userId' in req.body && req.body.userId != ""){
            let regexp = new RegExp(/^\d+$/);
            if(!regexp.test(req.body.userId)){
                return res.status(httpStatus.BAD_REQUEST).json({error: "ID can't contain non-numeric characters"});
            }

            if('gameId' in req.body && req.body.gameId != ""){
                let regexp = new RegExp(/^\d+$/);
                if(!regexp.test(req.body.gameId)){
                    return res.status(httpStatus.BAD_REQUEST).json({error: "ID can't contain non-numeric characters"});
                }
            }   else {
                return res.status(httpStatus.BAD_REQUEST).json({error: "Game ID missing from request"});
            }
        }   else{
            return res.status(httpStatus.BAD_REQUEST).json({error: "User ID missing from request"});
        }

        try{
            await auth.verifyUserDelete(req.headers['x-access-token'],req.body.userId)

            let deletedReview = await Review.destroy({
                where: {
                    userId: req.body.userId,
                    gameId: req.body.gameId
                }
            })
            if(deletedReview == 0){
                return res.status(httpStatus.NOT_FOUND).json({error: "Review with the requested ID was not found"});
            }   else {
                return res.status(httpStatus.OK).json({error: "Review with the requested ID was deleted"});
            }
        }
        catch(error){
            if(error.status == httpStatus.UNAUTHORIZED || error.status == httpStatus.FORBIDDEN){
                return res.status(error.status).end(error.message)
            }   else{
                console.log(error);
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: "Internal server error"});
            }
        }
    },
    findRecent: async (req,res) => {
        try{
            reviews = await Review.findAll({include: [Game, User], limit: 5, order: [['createdAt','DESC']]});

            if(reviews == null){
                res.set("Info","No reviews were found");
                return res.status(httpStatus.NO_CONTENT).end();
            }
            return res.json(reviews);
        }
        catch(error){
            if(error.status == httpStatus.UNAUTHORIZED || error.status == httpStatus.FORBIDDEN){
                return res.status(error.status).end(error.message)
            }   else{
                console.log(error);
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: "Internal server error"});
            }
        }
    }
}

module.exports = methods;