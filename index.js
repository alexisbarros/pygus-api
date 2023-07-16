const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv/config');

mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}).then(() => console.log('Connected to db!!'))

const usersRoutes = require('./routes/users.route');
const authRoutes = require('./routes/auth.route');
const tasksRoutes = require('./routes/tasks.route');
const authMiddleware = require('./middleware/auth.middleware');

const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/users', usersRoutes);
app.use('/auth', authRoutes);
// app.use('/tasks', authMiddleware, tasksRoutes);
app.use('/tasks', tasksRoutes);
app.use('/public/tasks_images', express.static(__dirname + '/public/tasks_images'));
app.use('/public/tasks_audios', express.static(__dirname + '/public/tasks_audios'));
app.use('/public/tasks_complete_audios', express.static(__dirname + '/public/tasks_complete_audios'));

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})