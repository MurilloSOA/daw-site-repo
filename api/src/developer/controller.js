const httpStatus = require("http-status");
const { sequelize, Sequelize } = require("../configs/sequelize");
const { Op } = Sequelize;
const Developer = require('./model');

let methods = {};

methods = {

    create: async (req,res) => {
        if('name' in req.body && req.body.name != ""){
            let developer = await Developer.findOne({where: {name: req.body.name}})

            if(developer != null){
                return res.status(httpStatus.CONFLICT).end("Developer with provided name already exists");
            }
        }   else{
            return res.status(httpStatus.BAD_REQUEST).end("Description missing from request");
        }
        try{
            let developer = await Developer.create({
                name: req.body.name
            })

            return res.status(httpStatus.CREATED).send(developer);
        }
        catch(error){
            console.error(error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
        }
    },
    findAll: async (req,res) => {
        try{
            let developers = await Developer.findAll();
            if(developers == null){
                res.set("Info","No developers were found");
                return res.status(httpStatus.NO_CONTENT).end();
            }
            return res.json(developers);
        }
        catch(error){
            console.log(error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
        }
    },
    findById: async (req,res) => {
        let regexp = new RegExp(/^\d+$/);
        if(!regexp.test(req.params.id)){
            return res.status(httpStatus.BAD_REQUEST).end("ID can't contain non-numeric characters");
        }
        
        try{
            let developer = await Developer.findByPk(req.params.id)
            if(developer == null){
                return res.status(httpStatus.NOT_FOUND).end("Developer with requested ID was not found");
            }else{
                return res.send(developer);
            }
        }
        catch(error){
            console.log(error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
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

        if(!('name' in req.body && req.body.name != "")){
            return res.status(httpStatus.BAD_REQUEST).end("No values were provided");
        }

        try{
            let developer = await Developer.findByPk(req.body.id);

            if(developer == null){
                return res.status(httpStatus.NOT_FOUND).end("Developer with requested ID was not found");
            }   else{
                if('name' in req.body){
                    developer.name = req.body.name;
                }

                let modifiedDeveloper = await developer.save();
                return res.send(modifiedDeveloper);
            }
        }
        catch(error){
            console.log(error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
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
            let deletedDeveloper = await Developer.destroy({
                where: {
                    id: req.body.id
                }
            })
            if(deletedDeveloper == 0){
                return res.status(httpStatus.NOT_FOUND).end("Developer with the requested ID was not found");
            }   else {
                return res.status(httpStatus.OK).send("Developer with the requested ID was deleted");
            }
        }
        catch(error){
            console.log(error);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
        }
    }
}

module.exports = methods;