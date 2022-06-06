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
                return res.status(httpStatus.CONFLICT).end("Game with provided name already exists");
            }
        }   else{
            return res.status(httpStatus.BAD_REQUEST).end("Name missing from request");
        }

        if(!('description' in req.body && req.body.description != "")){
            return res.status(httpStatus.BAD_REQUEST).end("Description missing from request");
        }
        
        if('launchDate' in req.body && req.body.launchDate != ""){
            if((new Date(req.body.launchDate) == "Invalid Date") || isNaN(new Date(req.body.launchDate))){
                console.log(new Date(req.body.launchDate));
                return res.status(httpStatus.BAD_REQUEST).end("Provided Date is invalid")
            }
        }   else{
            return res.status(httpStatus.BAD_REQUEST).end("Launch Date missing from request");
        }

        if('developerId' in req.body && req.body.developerId != ""){
            let regexp = new RegExp(/^\d+$/);
            if(!regexp.test(req.body.developerId)){
                return res.status(httpStatus.BAD_REQUEST).end("ID can't contain non-numeric characters");
            }

            let developer = await Developer.findOne({where: {id: req.body.developerId}})

            if(developer == null){
                return res.status(httpStatus.NOT_FOUND).end("Developer with requested ID was not found");
            }

        }   else{
            return res.status(httpStatus.BAD_REQUEST).end("Developer ID missing from request");
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
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
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
                return res.status(httpStatus.BAD_REQUEST).end("Year provided must contain numeric characters only")
            }else{
                if(req.query.launchYear.length != 4){
                    return res.status(httpStatus.BAD_REQUEST).end("Year provided is not valid")
                }

                if(req.query.launchYear < 1900 || req.query.launchYear > 2500){
                    return res.status(httpStatus.BAD_REQUEST).end("Year provided is out of range (must be between 1900 and 2500");
                }
            }

            let games = await Game.findAll({where: sequelize.where(sequelize.fn('YEAR', sequelize.col('launchDate')), req.query.launchYear)})
            if(games != null){
                return res.json(games);
            }
        }

        try{
            let games = await Game.findAll();
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
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
            }
        }
    },
    findById: async (req,res) => {
        let regexp = new RegExp(/^\d+$/);
        if(!regexp.test(req.params.id)){
            return res.status(httpStatus.BAD_REQUEST).end("ID can't contain non-numeric characters");
        }
        
        try{
            let game = await Game.findByPk(req.params.id)
            if(game == null){
                return res.status(httpStatus.NOT_FOUND).end("Game with requested ID was not found");
            }else{
                return res.send(game);
            }
        }
        catch(error){
            if(error.status == httpStatus.UNAUTHORIZED || error.status == httpStatus.FORBIDDEN){
                return res.status(error.status).end(error.message)
            }   else{
                console.log(error);
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
            }
        }
    },
    update: async (req,res) => {
        if('id' in req.body && req.body.id != ""){
            let regexp = new RegExp(/^\d+$/);
            if(!regexp.test(req.body.id)){
                return res.status(httpStatus.BAD_REQUEST).end("ID can't contain non-numeric characters");
            }
        }   else{
            return res.status(httpStatus.BAD_REQUEST).end("ID missing from request");
        }

        if(('description' in req.body && req.body.description != "") || ('launchDate' in req.body && req.body.launchDate != "") || ('developerId' in req.body && req.body.developerId != "")){
            if('launchDate' in req.body && req.body.launchDate != ""){
                if((new Date(req.body.launchDate) == "Invalid Date") || isNaN(new Date(req.body.launchDate))){
                    return res.status(httpStatus.BAD_REQUEST).end("Provided Date is invalid")
                }
            }

            if('developerId' in req.body && req.body.developerId != ""){
                let regexp = new RegExp(/^\d+$/);
                if(!regexp.test(req.body.developerId)){
                    return res.status(httpStatus.BAD_REQUEST).end("ID can't contain non-numeric characters");
                }

                let developer = await Developer.findOne({where: {id: req.body.developerId}})

                if(developer == null){
                    return res.status(httpStatus.NOT_FOUND).end("Developer with requested ID was not found");
                }
            }

        }else{
            return res.status(httpStatus.BAD_REQUEST).end("No values were provided for update")
        }

        try{
            await auth.verifyUserProfile(req.headers['x-access-token'],["Administrator","Moderator"])

            let game = await Game.findByPk(req.body.id);

            if(game == null){
                return res.status(httpStatus.NOT_FOUND).end("Game with requested ID was not found");
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
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
            }
        }
    },
    delete: async (req,res) => {
        if('id' in req.body && req.body.id != ""){
            let regexp = new RegExp(/^\d+$/);
            if(!regexp.test(req.body.id)){
                return res.status(httpStatus.BAD_REQUEST).end("ID can't contain non-numeric characters")
            }
        }   else {
            return res.status(httpStatus.BAD_REQUEST).end("ID missing from request");
        }

        try{
            await auth.verifyUserProfile(req.headers['x-access-token'],["Administrator","Moderator"])

            let deletedGame = await Game.destroy({
                where: {
                    id: req.body.id
                }
            })
            if(deletedGame == 0){
                return res.status(httpStatus.NOT_FOUND).end("Game with the requested ID was not found");
            }   else {
                return res.status(httpStatus.OK).end("Game with the requested ID was deleted");
            }
        }
        catch(error){
            if(error.status == httpStatus.UNAUTHORIZED || error.status == httpStatus.FORBIDDEN){
                return res.status(error.status).end(error.message)
            }   else{
                console.log(error);
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
            }
        }
    }
}

module.exports = methods;