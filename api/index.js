const express = require('express')
const cors = require('cors')
const app = express();
const bodyParser = require('body-parser')
const db = require('./src/configs/sequelize.js')
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors({origin: '*'}));

db.sequelize.sync({alter:true}).then(() => {
    console.log("Banco criado/alterado com sucesso.");
}).catch((error) => {
    console.log("Erro: "+error)
})

require('./src/routes.js')(app);

app.listen(PORT, function(){
    console.log("Server is running on port "+PORT+". Press Ctrl+C to stop...");
});