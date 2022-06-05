const { sequelize, Sequelize } = require("../configs/sequelize");
const UserProfile = require("../user-profile/model");
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

        try{
            let user = await User.create({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            })

            res.status(httpStatus.CREATED).send(user);
        }
        catch(error){
            console.log(error);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
        }
    },
    findAll: async (req,res) => {
        try{
            let users = await User.findAll()
            if(users == null){
                res.set("Info","No users were found");
                res.status(httpStatus.NO_CONTENT).end();
            }
            res.json(users);
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
            let user = await User.findByPk(req.params.id)
            if(user == null){
                res.set("Info","No user was found with the requested Id");
                res.status(httpStatus.NO_CONTENT).end();
            }   else {
                res.send(user);
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
                res.status(httpStatus.BAD_REQUEST).end("Id can't contain non-numeric characters")
            }
        }   else {
            res.status(httpStatus.BAD_REQUEST).end("Id missing from request");
        }

        if(('password' in req.body && req.body.password != "") || ('email' in req.body && req.body.email != "")){
            if('password' in req.body){
                if(req.body.password.length < 8){
                    return res.status(httpStatus.BAD_REQUEST).end("Password is too short");
                }
            }
            
            if('email' in req.body){
                let regexp = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

                if(!regexp.test(req.body.email)){
                    return res.status(httpStatus.BAD_REQUEST).end("Invalid email.");
                } 
            }
        }else{
            return res.status(httpStatus.BAD_REQUEST).end("No values were provided for update")
        }

        try{
            let user = await User.findByPk(req.body.id);
            if(user == null){
                res.set("Info","No user was found with the requested Id");
                res.status(httpStatus.NO_CONTENT).end();
            }   else {
                if('password' in req.body){
                    user.password = req.body.password;
                }
                if('email' in req.body){
                    user.email = req.body.email;
                }
                
                let modifiedUser = await user.save();
                res.send(modifiedUser);
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
            let deletedUser = await User.destroy({
                where: {
                    id: req.body.id
                }
            })
            if(deletedUser == 0){
                res.set("Info","Nothing was found to be deleted");
                res.status(httpStatus.NO_CONTENT).end();
            }   else {
                res.status(httpStatus.OK).send("The user with the requested Id was deleted");
            }

            res.json("User deleted successfully");
        }
        catch(error){
            console.log(error);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
        }
    }
}

module.exports = methods;