module.exports = (app) => {
    const controller = require("./controller.js")

    app.post('/profiles', (req,res) => {
        controller.create(req,res)
    });
    app.get('/profiles', (req,res) => {
        controller.findAll(req,res)
    });
    app.get('/profiles/:id', (req,res) => {
       controller.findById(req,res) 
    });
    app.put('/profiles', (req,res) => {
        controller.update(req,res)
    });
    app.delete('/profiles',(req,res) => {
        controller.delete(req,res)
    });
}