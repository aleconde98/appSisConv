const mongoose = require('mongoose');
const config = require('./config.json');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoString,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("Conectado a MongoDB");
    }).catch((e) => {
        console.log("Error conectando a MongoDB");
        console.log(e);
    });

//Quitar Aviso Depreciación
// mongoose.set('strictQuery', true);


module.exports = {
    mongoose
};