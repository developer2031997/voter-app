const express = require('express');
const connectMongoDB = require("./coonection");
require('dotenv').config();

const PORT = process.env.PORT;
const MONGO_DB_URL = process.env.MONGO_DB_URL;

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

connectMongoDB(MONGO_DB_URL);


const userRouter = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");

app.use('/users' , userRouter);
app.use('/candidate' , candidateRoutes);


// Start the server
app.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`);
});