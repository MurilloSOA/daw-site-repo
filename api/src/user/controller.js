const { sequelize, Sequelize } = require("../configs/sequelize");
const httpStatus = require('http-status');
const { Op } = Sequelize;
const User = require('./model');

let methods = {};

methods = {
    create: async (req,res) => {
        if('username' in req.body && req.body.username != ""){
            let user = await User.findOne({where: {username: req.body.username}})

            if(user != null){
                return res.status(httpStatus.CONFLICT).end("Username already exists");
            }

        }else{
            return res.status(httpStatus.BAD_REQUEST).end("Username missing from request");
        }

        if('email' in req.body && req.body.email != ""){
            let regexp = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

            if(!regexp.test(req.body.email)){
                return res.status(httpStatus.BAD_REQUEST).end("Invalid email.");
            } 
        }else{
            return res.status(httpStatus.BAD_REQUEST).end("Email missing from request");
        }
        
        if('password' in req.body && req.body.password != ""){
            if(req.body.password.length < 8){
                return res.status(httpStatus.BAD_REQUEST).end("Password is too short");
            }
        }else{
            return res.status(httpStatus.BAD_REQUEST).end("Password missing from request");
        }

        if('profileId' in req.body && req.body.profileId != ""){
            let regexp = new RegExp(/^\d+$/);
            if(!regexp.test(req.body.profileId)){
                return res.status(httpStatus.BAD_REQUEST).end("Profile ID can't contain non-numeric characters");
            }
        }else{
            return res.status(httpStatus.BAD_REQUEST).end("Profile ID missing from request");
        }

        try{
            let user = await User.create({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profileId: req.body.profileId
            })

            return res.status(httpStatus.CREATED).send(user);
        }
        catch(error){
            console.log(error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
        }
    },
    findAll: async (req,res) => {
        try{
            let users = await User.findAll()
            if(users == null){
                res.set("Info","No users were found");
                return res.status(httpStatus.NO_CONTENT).end();
            }
            return res.json(users);
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
            let user = await User.findByPk(req.params.id)
            if(user == null){
                return res.status(httpStatus.NOT_FOUND).end("User with requested ID was not found");
            }   else {
                return res.send(user);
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
                return res.status(httpStatus.BAD_REQUEST).end("ID can't contain non-numeric characters")
            }
        }   else {
            return res.status(httpStatus.BAD_REQUEST).end("ID missing from request");
        }

        if(('password' in req.body && req.body.password != "") || ('email' in req.body && req.body.email != "") || ('profileId' in req.body && req.body.profileId != "")){
            if('password' in req.body && req.body.password != ""){
                if(req.body.password.length < 8){
                    return res.status(httpStatus.BAD_REQUEST).end("Password is too short");
                }
            }
            
            if('email' in req.body && req.body.email != ""){
                let regexp = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

                if(!regexp.test(req.body.email)){
                    return res.status(httpStatus.BAD_REQUEST).end("Invalid email.");
                } 
            }

            if('profileId' in req.body && req.body.profileId != ""){
                let regexp = new RegExp(/^\d+$/);
                if(!regexp.test(req.body.profileId)){
                    return res.status(httpStatus.BAD_REQUEST).end("Profile ID can't contain non-numeric characters")
                }
            }
        }else{
            return res.status(httpStatus.BAD_REQUEST).end("No values were provided for update")
        }

        try{
            let user = await User.findByPk(req.body.id);
            if(user == null){
                return res.status(httpStatus.NOT_FOUND).end("User with the requested ID was not found");
            }   else {
                if('password' in req.body && req.body.password != ""){
                    user.password = req.body.password;
                }
                if('email' in req.body && req.body.email != ""){
                    user.email = req.body.email;
                }
                if('profileId' in req.body && req.body.profileId != ""){
                    user.profileId = req.body.profileId;
                }
                
                let modifiedUser = await user.save();
                return res.send(modifiedUser);
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
                res.status(httpStatus.BAD_REQUEST).end("ID can't contain non-numeric characters")
            }
        }   else {
            return res.status(httpStatus.BAD_REQUEST).end("ID missing from request");
        }
        try{
            let deletedUser = await User.destroy({
                where: {
                    id: req.body.id
                }
            })
            if(deletedUser == 0){
                return res.status(httpStatus.NOT_FOUND).end("User with the requested ID was not found");
            }   else {
                return res.status(httpStatus.OK).send("User with the requested ID was deleted");
            }
        }
        catch(error){
            console.log(error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
        }
    }
}

module.exports = methods;