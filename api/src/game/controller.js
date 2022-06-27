const httpStatus = require("http-status");
const { sequelize, Sequelize } = require("../configs/sequelize");
const { Op } = Sequelize;
const Game = require('./model');
const Developer = require("../developer/model");
const auth = require('../core/auth')

let methods = {};

methods = {

    create: async (req,res) => {
        if('name' in req.body && req.body.name != ""){
            let game = await Game.findOne({where: {name: req.body.name}})

            if(game != null){
                return res.status(httpStatus.CONFLICT).json({error: "Game with provided name already exists"});
            }
        }   else{
            return res.status(httpStatus.BAD_REQUEST).json({error: "Name missing from request"});
        }

        if(!('description' in req.body && req.body.description != "")){
            return res.status(httpStatus.BAD_REQUEST).json({error: "Description missing from request"});
        }
        
        if('launchDate' in req.body && req.body.launchDate != ""){
            if((new Date(req.body.launchDate) == "Invalid Date") || isNaN(new Date(req.body.launchDate))){
                console.log(new Date(req.body.launchDate));
                return res.status(httpStatus.BAD_REQUEST).json({error: "Provided Date is invalid"})
            }
        }   else{
            return res.status(httpStatus.BAD_REQUEST).json({error: "Launch Date missing from request"});
        }

        if('developerId' in req.body && req.body.developerId != ""){
            let regexp = new RegExp(/^\d+$/);
            if(!regexp.test(req.body.developerId)){
                return res.status(httpStatus.BAD_REQUEST).json({error: "ID can't contain non-numeric characters"});
            }

            let developer = await Developer.findOne({where: {id: req.body.developerId}})

            if(developer == null){
                return res.status(httpStatus.NOT_FOUND).json({error: "Developer with requested ID was not found"});
            }

        }   else{
            return res.status(httpStatus.BAD_REQUEST).json({error: "Developer ID missing from request"});
        }

        try{
            await auth.verifyUserProfile(req.headers['x-access-token'],["Administrator","Moderator"])

            let game = await Game.create({
                name: req.body.name,
                description: req.body.description,
                launchDate: req.body.launchDate,
                developerId: req.body.developerId
            })

            return res.status(httpStatus.CREATED).send(game);
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
    findAll: async (req,res) => {
        if('name' in req.query && req.query.name != ""){
            let games = await Game.findAll({where: {name: req.query.name}});
            if(games != null){
                return res.json(games)
            }
        }

        if('launchYear' in req.query && req.query.launchYear != ""){
            let regexp = new RegExp(/^[0-9]+$/)
            if(!regexp.test(req.query.launchYear)){
                return res.status(httpStatus.BAD_REQUEST).json({error: "Year provided must contain numeric characters only"})
            }else{
                if(req.query.launchYear.length != 4){
                    return res.status(httpStatus.BAD_REQUEST).json({error: "Year provided is not valid"})
                }

                if(req.query.launchYear < 1900 || req.query.launchYear > 2500){
                    return res.status(httpStatus.BAD_REQUEST).json({error: "Year provided is out of range (must be between 1900 and 2500"});
                }
            }

            let games = await Game.findAll({where: sequelize.where(sequelize.fn('YEAR', sequelize.col('launchDate')), req.query.launchYear)})
            if(games != null){
                return res.json(games);
            }
        }

        try{
            let games = await Game.findAll({include: Developer});
            if(games == null){
                res.set("Info","No games were found");
                return res.status(httpStatus.NO_CONTENT).end();
            }
            return res.json(games);
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
    findById: async (req,res) => {
        let regexp = new RegExp(/^\d+$/);
        if(!regexp.test(req.params.id)){
            return res.status(httpStatus.BAD_REQUEST).json({error: "ID can't contain non-numeric characters"});
        }
        
        try{
            let game = await Game.findByPk(req.params.id,{include: Developer});
            if(game == null){
                return res.status(httpStatus.NOT_FOUND).json({error: "Game with requested ID was not found"});
            }else{
                return res.send(game);
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
    update: async (req,res) => {
        if('id' in req.body && req.body.id != ""){
            let regexp = new RegExp(/^\d+$/);
            if(!regexp.test(req.body.id)){
                return res.status(httpStatus.BAD_REQUEST).json({error: "ID can't contain non-numeric characters"});
            }
        }   else{
            return res.status(httpStatus.BAD_REQUEST).json({error: "ID missing from request"});
        }

        if(('description' in req.body && req.body.description != "") || ('launchDate' in req.body && req.body.launchDate != "") || ('developerId' in req.body && req.body.developerId != "")){
            if('launchDate' in req.body && req.body.launchDate != ""){
                if((new Date(req.body.launchDate) == "Invalid Date") || isNaN(new Date(req.body.launchDate))){
                    return res.status(httpStatus.BAD_REQUEST).json({error: "Provided Date is invalid"})
                }
            }

            if('developerId' in req.body && req.body.developerId != ""){
                let regexp = new RegExp(/^\d+$/);
                if(!regexp.test(req.body.developerId)){
                    return res.status(httpStatus.BAD_REQUEST).json({error: "ID can't contain non-numeric characters"});
                }

                let developer = await Developer.findOne({where: {id: req.body.developerId}})

                if(developer == null){
                    return res.status(httpStatus.NOT_FOUND).json({error: "Developer with requested ID was not found"});
                }
            }

        }else{
            return res.status(httpStatus.BAD_REQUEST).json({error: "No values were provided for update"})
        }

        try{
            await auth.verifyUserProfile(req.headers['x-access-token'],["Administrator","Moderator"])

            let game = await Game.findByPk(req.body.id);

            if(game == null){
                return res.status(httpStatus.NOT_FOUND).json({error: "Game with requested ID was not found"});
            }   else{
                if('description' in req.body && req.body.description != ""){
                    game.description = req.body.description;
                }

                if('launchDate' in req.body && req.body.launchDate != ""){
                    game.launchDate = req.body.launchDate
                }

                if('developerId' in req.body && req.body.developerId != ""){
                    game.developerId = req.body.developerId
                }

                let modifiedGame = await game.save();
                return res.send(modifiedGame);
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
        if('id' in req.body && req.body.id != ""){
            let regexp = new RegExp(/^\d+$/);
            if(!regexp.test(req.body.id)){
                return res.status(httpStatus.BAD_REQUEST).json({error: "ID can't contain non-numeric characters"})
            }
        }   else {
            return res.status(httpStatus.BAD_REQUEST).json({error: "ID missing from request"});
        }

        try{
            await auth.verifyUserProfile(req.headers['x-access-token'],["Administrator","Moderator"])

            let deletedGame = await Game.destroy({
                where: {
                    id: req.body.id
                }
            })
            if(deletedGame == 0){
                return res.status(httpStatus.NOT_FOUND).json({error: "Game with the requested ID was not found"});
            }   else {
                return res.status(httpStatus.OK).json({error: "Game with the requested ID was deleted"});
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
    },findRecent: async (req,res) => {
        try{
            let games = await Game.findAll({limit: 5, order: [["createdAt",'DESC']]})
            if(games == null){
                res.set("Info","No games were found");
                return res.status(httpStatus.NO_CONTENT).end();
            }
            return res.json(games);
        }
        catch(error){
            if(error.status == httpStatus.UNAUTHORIZED || error.status == httpStatus.FORBIDDEN){
                return res.status(error.status).json({error: error.message});
            }   else{
                console.log(error);
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: "Internal server error"});
            }
        }
    }
}

module.exports = methods;