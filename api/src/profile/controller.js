const httpStatus = require("http-status");
const { sequelize, Sequelize } = require("../configs/sequelize");
const { Op } = Sequelize;
const Profile = require('./model');
const auth = require('../core/auth')

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
            await verifyUserProfile(req.headers['x-access-token'],["Administrator","Moderator"])

            let profile = await Profile.create({
                description: req.body.description
            })

            return res.status(httpStatus.CREATED).send(profile);
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
        try{
            await verifyUserProfile(req.headers['x-access-token'],["Administrator","Moderator"])

            let profiles = await Profile.findAll();
            if(profiles == null){
                res.set("Info","No profiles were found");
                return res.status(httpStatus.NO_CONTENT).end();
            }
            return res.json(profiles);
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
            await verifyUserProfile(req.headers['x-access-token'],["Administrator","Moderator"])

            let profile = await Profile.findByPk(req.params.id)
            if(profile == null){
                return res.status(httpStatus.NOT_FOUND).end("Profile with requested ID was not found");
            }else{
                return res.send(profile);
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

        if(!('description' in req.body && req.body.description != "")){
            return res.status(httpStatus.BAD_REQUEST).end("No values were provided");
        }

        try{
            await verifyUserProfile(req.headers['x-access-token'],["Administrator","Moderator"])

            let profile = await Profile.findByPk(req.body.id);

            if(profile == null){
                return res.status(httpStatus.NOT_FOUND).end("Profile with requested ID was not found");
            }   else{
                if('description' in req.body){
                    profile.description = req.body.description;
                }

                let modifiedProfile = await profile.save();
                return res.send(modifiedProfile);
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
            await verifyUserProfile(req.headers['x-access-token'],["Administrator","Moderator"])

            let deletedProfile = await Profile.destroy({
                where: {
                    id: req.body.id
                }
            })
            if(deletedProfile == 0){
                return res.status(httpStatus.NOT_FOUND).end("Profile with the requested ID was not found");
            }   else {
                return res.status(httpStatus.OK).end("Profile with the requested ID was deleted");
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