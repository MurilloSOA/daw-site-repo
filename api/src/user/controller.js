const { sequelize, Sequelize } = require("../configs/sequelize");
const UserProfile = require("../user-profile/model");
const { Op } = Sequelize;
const User = require('./model');

let methods = {};

methods = {
    create: async (req,res) => {
        let user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        .catch((error) => {
            console.log("Erro: "+ error);
        });

        res.send(user);
    },
    findAll: async (req,res) => {
        let users = await User.findAll()
        .catch((error) => {
            console.log("Erro: "+ error);
        });

        res.json(users);
    },
    findById: async (req,res) => {
        let user = await User.findByPk(req.query.id)
        .catch((error) => {
            console.log("Erro: "+ error);
        });

        res.json(user);
    },
    findByUsername: async (req,res) => {
        let user = await User.findOne ({ where: {username: req.query.username}})
        .catch((error) => {
            console.log("Erro: "+ error);
        });

        res.json(user);
    },
    update: async (req,res) => {
        let user = await User.findByPk(req.body.id)
        .catch((error) => {
            console.log("Erro: " + error);
        })

        if('password' in req.body){
            user.password = req.body.password;
        }
        if('email' in req.body){
            user.email = req.body.email;
        }

        let nAffected = await user.save()
        .catch((error) => {
            console.log("Erro: " + error);
        })

        res.json({msg:"OK", nAffected: nAffected});
    },
    delete: async (req,res) => {
        let nAffected = await User.destroy({
            where: {
                id: req.body.id
            }
        }).catch((error) => {
            console.log("Erro: " + error)
        });

        res.json({msg:"OK", nAffected: nAffected});
    }
}

module.exports = methods;