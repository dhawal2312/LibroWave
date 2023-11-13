const mongoose = require('mongoose');
const url = process.env.mongoURI;
const connectDB = async () => {
   
    try {

        await mongoose.connect(url), {
            useNewUrlParser: true,
            useCreateIndex: true
        };
        console.log("Connected");
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = connectDB;