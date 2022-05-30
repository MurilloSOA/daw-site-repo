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
                return res.status(httpStatus.CONFLICT).end("Username already exists") 
            }

        }else{
            return res.status(httpStatus.BAD_REQUEST).end("Username missing from request");
        }

        if('email' in req.body && req.body.email == ""){
            let regexp = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

            if(!regexp.test(req.body.email)){
                return res.status(httpStatus.BAD_REQUEST).end("Invalid email.")
            } 
        }else{
            return res.status(httpStatus.BAD_REQUEST).end("Email missing from request");
        }
        
        if('password' in req.body && req.body.password == ""){
            if(req.body.password.length < 8){
                return res.status(httpStatus.BAD_REQUEST).end("Password is too short");
            }
        }else{
            return res.status(httpStatus.BAD_REQUEST).end("Password missing from request")
        }

        try{
            let user = await User.create({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            })

            res.send(user);
        }
        catch(error){
            console.log(error);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
        }
    },
    findAll: async (req,res) => {
        try{
            let users = await User.findAll()
            res.json(users);
        }
        catch(error){
            console.log(error);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
        }
    },
    findById: async (req,res) => {
        try{
            let user = await User.findByPk(req.params.id)
            res.json(user);
        }
        catch(error){
            console.log(error);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
        }
    },
    update: async (req,res) => {
        try{
            let user = await User.findByPk(req.body.id);

            if('password' in req.body){
                user.password = req.body.password;
            }
            if('email' in req.body){
                user.email = req.body.email;
            }
    
            let nAffected = await user.save();

            res.json({msg:"OK", nAffected: nAffected});
        }

        catch(error){
            console.log(error);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
        }
    },
    delete: async (req,res) => {
        if('id' in req.body){
            let regexp = new RegExp(/^\d+$/);
            if(!regexp.test(req.body.id)){
                res.status(httpStatus.BAD_REQUEST).end("Id can't contain non-numeric characters")
            }
        }   else {
            res.status(httpStatus.BAD_REQUEST).end("Id missing from request");
        }

        try{
            let nAffected = await User.destroy({
                where: {
                    id: req.body.id
                }
            })

            res.json({msg:"OK", nAffected: nAffected});
        }
        catch(error){
            console.log(error);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).end("Internal server error");
        }
    }
}

module.exports = methods;