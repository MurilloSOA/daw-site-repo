const httpStatus = require("http-status");
const { sequelize, Sequelize } = require("../configs/sequelize");
const { Op } = Sequelize;
const User = require('../user/model');
const Profile = require('../profile/model');
const UserProfile = require('./model');

let methods = {};

methods = {

    create: async (req,res) => {
        if('userId' in req.body && req.body.userId != ""){
            let regexp = new RegExp(/^\d+$/);
            if(!regexp.test(req.body.userId)){
                return res.status(httpStatus.BAD_REQUEST).end("ID can't contain non-numeric characters");
            }

            let user = await User.findOne({where: {userId: req.body.userId}})

            if(user == null){
                return res.status(httpStatus.NOT_FOUND).end("User with requested ID was not found");
            }

            if('profileId' in req.body && req.body.profileId != ""){
                let regexp = new RegExp(/^\d+$/);
                if(!regexp.test(req.body.profileId)){
                    return res.status(httpStatus.BAD_REQUEST).end("ID can't contain non-numeric characters");
                }

                let profile = await Profile.findOne({where: {profileId: req.body.profileId}})
    
                if(profile == null){
                    return res.status(httpStatus.NOT_FOUND).end("Profile with requested ID was not found");
                }

            }   else{
                return res.status(httpStatus.BAD_REQUEST).end("Profile ID missing from request");
            }

        }   else{
            return res.status(httpStatus.BAD_REQUEST).end("User ID missing from request");
        }

        try{
            let userProfile = await UserProfile.create({
                userId: req.body.userId,
                profileId: req.body.profileId
            })

            return res.status(httpStatus.CREATED).send(userProfile);
        }
        catch(error){
            console.error(error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
        }
    },
    findAll: async (req,res) => {
        try{
            let userProfiles = await UserProfile.findAll();
            if(userProfiles == null){
                res.set("Info","No User Profile connections were found");
                return res.status(httpStatus.NO_CONTENT).end();
            }
            return res.json(userProfiles);
        }
        catch(error){
            console.log(error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
        }
    },
    findById: async (req,res) => {
        if('userId' in req.params && req.params.userId != ""){
            let regexp = new RegExp(/^\d+$/);
            if(!regexp.test(req.body.userId)){
                return res.status(httpStatus.BAD_REQUEST).end("ID can't contain non-numeric characters");
            }

            try{
                let userProfiles = await UserProfile.findAll();
                if(userProfiles == null){
                    res.set("Info","No User Profile connections were found");
                    return res.status(httpStatus.NO_CONTENT).end();
                }
                return res.json(userProfiles);
            }
            catch(error){
                console.log(error);
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
            }

        }

        if('profileId' in req.body && req.body.profileId != ""){
            let regexp = new RegExp(/^\d+$/);
            if(!regexp.test(req.body.profileId)){
                return res.status(httpStatus.BAD_REQUEST).end("ID can't contain non-numeric characters");
            }

            try{
                let userProfiles = await UserProfile.findAll();
                if(userProfiles == null){
                    res.set("Info","No User Profile connections were found");
                    return res.status(httpStatus.NO_CONTENT).end();
                }
                return res.json(userProfiles);
            }
            catch(error){
                console.log(error);
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
            }
        }
    },
    update: async (req,res) => {
        if('id' in req.body && req.body.id != ""){
            let regexp = new RegExp(/^\d+$/);
            if(!regexp.test(req.body.id)){
                return res.status(httpStatus.BAD_REQUEST).end("Id can't contain non-numeric characters");
            }
        }   else{
            return res.status(httpStatus.BAD_REQUEST).end("Id missing from request");
        }

        if(!('description' in req.body && req.body.description != "")){
            return res.status(httpStatus.BAD_REQUEST).end("No values were provided");
        }

        try{
            let profile = await Profile.findByPk(req.body.id);

            if(profile == null){
                res.set("Info","No profile was found with the requested Id");
                return res.status(httpStatus.NO_CONTENT).end();
            }   else{
                if('description' in req.body){
                    profile.description = req.body.description;
                }

                let modifiedProfile = await profile.save();
                return res.send(modifiedProfile);
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
                return res.status(httpStatus.BAD_REQUEST).end("Id can't contain non-numeric characters")
            }
        }   else {
            return res.status(httpStatus.BAD_REQUEST).end("Id missing from request");
        }

        try{
            let deletedProfile = await Profile.destroy({
                where: {
                    id: req.body.id
                }
            })
            if(deletedProfile == 0){
                res.set("Info","Nothing was found to be deleted");
                return res.status(httpStatus.NO_CONTENT).end();
            }   else {
                return res.status(httpStatus.OK).send("The profile with the requested Id was deleted");
            }
        }
        catch(error){
            console.log(error);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
        }
    }
}

module.exports = methods;