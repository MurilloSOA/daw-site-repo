module.exports = (app) => {
    const controller = require("./controller.js")

    app.post('/games', (req,res) => {
        controller.create(req,res)
    });
    app.get('/games', (req,res) => {
        controller.findAll(req,res)
    });
    app.get('/games/:id', (req,res) => {
       controller.findById(req,res) 
    });
    app.put('/games', (req,res) => {
        controller.update(req,res)
    });
    app.delete('/games',(req,res) => {
        controller.delete(req,res)
    });
    app.get('/game/findRecent', (req,res) => {
        controller.findRecent(req,res)
    })
}