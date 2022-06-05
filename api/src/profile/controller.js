const httpStatus = require("http-status");
const { sequelize, Sequelize } = require("../configs/sequelize");
const UserProfile = require("../user-profile/model");
const { Op } = Sequelize;
const Profile = require('./model');

let methods = {};

methods = {

    create: async (req,res) => {
        if('description' in req.body && req.body.description != ""){
            let profile = await Profile.findOne({where: {description: req.body.description}})

            if(profile != null){
                return res.status(httpStatus.CONFLICT).end("Profile with provided description already exists");
            }
        }   else{
            return res.status(httpStatus.BAD_REQUEST).end("Description missing from request");
        }
        try{
            let profile = await Profile.create({
                description: req.body.description
            })

            res.status(httpStatus.CREATED).send(profile);
        }
        catch(error){
            console.error(error);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
        }
    },
    findAll: async (req,res) => {
        try{
            let profiles = await Profile.findAll();
            if(profiles == null){
                res.set("Info","No profiles were found");
                res.status(httpStatus.NO_CONTENT).end();
            }
            res.json(profiles);
        }
        catch(error){
            console.log(error);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
        }
    },
    findById: async (req,res) => {
        if("id" in req.params && req.params.id != ""){
            let regexp = new RegExp(/^\d+$/);
            if(!regexp.test(req.params.id)){
                res.status(httpStatus.BAD_REQUEST).end("Id can't contain non-numeric characters");
            }
        }else{
            res.status(httpStatus.BAD_REQUEST).end("Id missing from request");
        }
        
        try{
            let profile = await Profile.findByPk(req.params.id)
            if(profile == null){
                res.set("Info","No profile was found with the requested Id");
                res.status(httpStatus.NO_CONTENT).end();
            }else{
                res.send(profile);
            }
        }
        catch(error){
            console.log(error);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
        }
    },
    update: async (req,res) => {
        if('id' in req.body && req.body.id != ""){
            let regexp = new RegExp(/^\d+$/);
            if(!regexp.test(req.body.id)){
                res.status(httpStatus.BAD_REQUEST).end("Id can't contain non-numeric characters");
            }
        }   else{
            res.status(httpStatus.BAD_REQUEST).end("Id missing from request");
        }

        if(!('description' in req.body && req.body.description != "")){
            res.status(httpStatus.BAD_REQUEST).end("No values were provided");
        }

        try{
            let profile = await Profile.findByPk(req.body.id);

            if(profile == null){
                res.set("Info","No profile was found with the requested Id");
                res.status(httpStatus.NO_CONTENT).end();
            }   else{
                if('description' in req.body){
                    profile.description = req.body.description;
                }

                let modifiedProfile = await profile.save();
                res.send(modifiedProfile);
            }
        }
        catch(error){
            console.log(error);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
        }
    },
    delete: async (req,res) => {
        if('id' in req.body && req.body.id != ""){
            let regexp = new RegExp(/^\d+$/);
            if(!regexp.test(req.body.id)){
                res.status(httpStatus.BAD_REQUEST).end("Id can't contain non-numeric characters")
            }
        }   else {
            res.status(httpStatus.BAD_REQUEST).end("Id missing from request");
        }

        try{
            let deletedProfile = await Profile.destroy({
                where: {
                    id: req.body.id
                }
            })
            if(deletedProfile == 0){
                res.set("Info","Nothing was found to be deleted");
                res.status(httpStatus.NO_CONTENT).end();
            }   else {
                res.status(httpStatus.OK).send("The profile with the requested Id was deleted");
            }

            res.json("Profile deleted successfully");
        }
        catch(error){
            console.log(error);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
        }
    }
}

module.exports = methods;