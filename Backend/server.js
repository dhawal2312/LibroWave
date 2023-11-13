require("dotenv").config({
    path:"./dev.env"
});
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();

app.use(cors());

connectDB();

app.use(express.json({ extended: false }));

app.use('/api/users',require('./routes/users'));
app.use('/api/auth',require('./routes/auth'));
app.use('/api/book',require('./routes/book'));
app.use('/api/notification',require('./routes/notification'));

const PORT = 5000;

app.listen(PORT, () => {
    console.log("Server started on " + PORT);
})