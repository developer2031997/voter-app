const mongoose = require('mongoose');

function connectMongoDB(url){
    return mongoose
        .connect(url)
        .then(() => console.log("voter app Database connected"))
        .catch((err) => console.log("Error:", err));
}

module.exports = connectMongoDB;
