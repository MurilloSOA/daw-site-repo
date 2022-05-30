const { sequelize, Sequelize } = require("../configs/sequelize");
const { Op } = Sequelize;
const User = require('./model');

let methods = {};

methods = {
    create:{},
    findAll:{},
    findSpecific:{},
    update:{},
    delete:{}
}

module.exports = methods;