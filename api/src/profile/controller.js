const { sequelize, Sequelize } = require("../configs/sequelize");
const UserProfile = require("../user-profile/model");
const { Op } = Sequelize;
const Profile = require('./model');

let methods = {};

methods = {

    create: async (req,res) => {
        let profile = await Profile.create({
            description: req.body.description
        })
        .catch((error) => {
            console.log("Erro: "+ error);
        });

        res.send(profile);
    },
    findAll: async (req,res) => {
        let profiles = await Profile.findAll()
        .catch((error) => {
            console.log("Erro: "+ error);
        });

        res.json(profiles);
    },
    update: async (req,res) => {
        let profile = await Profile.findByPk(req.body.id)
        .catch((error) => {
            console.log("Erro: " + error);
        })
        
        profile.description = req.body.description

        let nAffected = await profile.save()
        .catch((error) => {
            console.log("Erro: " + error);
        })

        res.json({msg:"OK", nAffected: nAffected});
    },
    delete: async (req,res) => {
        let nAffected = await Profile.destroy({
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