module.exports = (app) => {
    const controller = require("./controller.js")

    app.post('/reviews', (req,res) => {
        controller.create(req,res)
    });
    app.get('/reviews', (req,res) => {
        controller.findReviews(req,res)
    });
    app.put('/reviews', (req,res) => {
        controller.update(req,res)
    });
    app.delete('/reviews',(req,res) => {
        controller.delete(req,res)
    });
}