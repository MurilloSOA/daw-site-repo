module.exports = (app) => {
    const controller = require("./controller.js")

    app.post('/users', (req,res) => {
        controller.create(req,res)
    });
    app.get('/users', (req,res) => {
        controller.findAll(req,res)
    });
    app.get('/users/:id', (req,res) => {
       controller.findById(req,res) 
    });
    app.put('/users', (req,res) => {
        controller.update(req,res)
    });
    app.delete('/users',(req,res) => {
        controller.delete(req,res)
    });
    app.post('/login', (req,res) => {
        controller.login(req,res)
    });
}