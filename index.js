// Modules
const express = require('express');
require('dotenv/config');
const bodyParser = require('body-parser')

// Routes modules
const usersRoutes = require('./routes/users.route');

// Variables
const port = process.env.SERVER_PORT || 3000;

// Start express app
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Routes
app.use('/users', usersRoutes);

// Run server
app.listen(port, () => {
    
    console.log(`Listening on port: ${port}`);

})