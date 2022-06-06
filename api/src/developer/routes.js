module.exports = (app) => {
    const controller = require("./controller.js")

    app.post('/developers', (req,res) => {
        controller.create(req,res)
    });
    app.get('/developers', (req,res) => {
        controller.findAll(req,res)
    });
    app.get('/developers/:id', (req,res) => {
       controller.findById(req,res) 
    });
    app.put('/developers', (req,res) => {
        controller.update(req,res)
    });
    app.delete('/developers',(req,res) => {
        controller.delete(req,res)
    });
}