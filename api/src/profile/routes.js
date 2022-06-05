module.exports = (app) => {
    const controller = require("./controller.js")

    app.post('/posts', (req,res) => {
        controller.create(req,res)
    });
    app.get('/posts', (req,res) => {
        controller.findAll(req,res)
    });
    app.get('/posts/:id', (req,res) => {
       controller.findById(req,res) 
    });
    app.put('/posts', (req,res) => {
        controller.update(req,res)
    });
    app.delete('/posts',(req,res) => {
        controller.delete(req,res)
    });
}