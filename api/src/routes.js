module.exports = (app) => {

    require('./user/routes.js')(app);
    require('./profile/routes.js')(app);
    require('./developer/routes.js')(app);
    require('./game/routes.js')(app);
    require('./review/routes.js')(app);
}