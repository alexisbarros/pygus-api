const mongoose = require('mongoose');
const fs = require('fs');
const multer = require('multer');

const Task = require('../models/tasks.model');

/**
 * Save image in server middleware
 */
const storage_image = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/tasks_images');
    },

    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
exports.uploadImg = multer({ storage: storage_image }).single('image');

/**
 * Save complete audio in server middleware
 */
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, './public/tasks_complete_audios');
    },

    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
exports.uploadCompleteWordAudio = multer({ storage: storage }).single('completeAudio');

/**
 * Save syllables audios in server middleware
 */
const storage_audio = multer.diskStorage({
    destination: function (req, file, cb) {
        const taskFolder = file.originalname.split('__')[0];
        const fullPath = `./public/tasks_audios/${taskFolder}`;
        if(!fs.existsSync(fullPath)){
            fs.mkdirSync(`./public/tasks_audios/${taskFolder}`);
        }
        cb(null, `./public/tasks_audios/${taskFolder}`);
    },

    filename: function (req, file, cb) {
        cb(null, file.originalname.split('__')[1]);
    }
});
exports.uploadAudio = multer({ storage: storage_audio }).array('audios');

/**
 * Register task in db.
 * @param {*} req 
 * @param {*} res 
 */
exports.create = async (req, res) => {

    try {
        // Connect to database
        await mongoose.connect(process.env.DB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Create task in database
        let task = await Task.create({
            name: req.body.name,
            syllables: req.body.syllables,
            phoneme: req.body.phoneme,
        });

        // Disconnect to database
        await mongoose.disconnect();

        // Create task data to return
        let taskToFront = {
            _id: task._id,
            _createdAt: task._createdAt,
            name: task.name,
            syllables: task.syllables,
            phoneme: task.phoneme,
        };

        console.info('Task created successfuly');
        res.send({
            data: taskToFront,
            message: 'Task created successfuly',
            code: 200
        });

    } catch (err) {

        // Disconnect to database
        await mongoose.disconnect();

        console.error(err.message);
        res.send({
            data: {},
            message: err.message,
            code: 400
        });

    }

};

/**
 * Get one task by id.
 * @param {*} req 
 * @param {*} res 
 */
exports.readOne = async (req, res) => {

    try {

        // Connect to database
        await mongoose.connect(process.env.DB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Get task by id
        let task = await Task.findById(req.params.id).select("-image");;

        // Check if task was removed
        if (task._deletedAt) throw { message: 'Task removed' };

        // let image = `https://firebasestorage.googleapis.com/v0/b/pygus-backoffice.appspot.com/o/images%2F${task.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()}.png?alt=media`
        // let image = `http://191.101.18.67:3000/public/tasks_images/${task.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()}.png`;

        // Create task data to return
        let taskToFront = {
            _id: task._id,
            _createdAt: task._createdAt,
            name: task.name,
            imageType: task.imageType,
            syllables: task.syllables,
            phoneme: task.phoneme,
        };

        // Disconnect to database
        await mongoose.disconnect();

        console.info('Task returned successfully');
        res.send({
            data: taskToFront,
            message: 'Task returned successfully',
            code: 200
        });

    } catch (err) {

        // Disconnect to database
        await mongoose.disconnect();

        console.error(err.message);
        res.send({
            data: {},
            message: err.message,
            code: 400
        });

    }

}

/**
 * Get all tasks.
 * @param {*} req 
 * @param {*} res 
 */
exports.readAll = async (req, res) => {

    try {

        // Connect to database
        await mongoose.connect(process.env.DB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Get all tasks
        let tasks = await Task.find({
            _deletedAt: null,
        }).select("-audios -completeWordAudio");

        // Get all phonemes
        let allPhonemes = tasks
            .map((el) => {
                return el['phoneme'];
            });
        let phonemes = [...new Set(allPhonemes)];

        // Create list of all tasks by phoneme
        let tasksByPhoneme = [];
        for (let index = 0; index < phonemes.length; index++) {
            let localTasks = tasks.filter((task) => task['phoneme'] === phonemes[index]);
            let elementToAdd = {
                'phoneme': phonemes[index],
                'tasks': localTasks,
            };
            tasksByPhoneme.push(elementToAdd);
        };

        // Disconnect to database
        await mongoose.disconnect();

        console.info('Tasks returned successfully');
        res.send({
            data: tasksByPhoneme,
            // data: tasksToFront,
            message: 'Tasks returned successfully',
            code: 200
        });

    } catch (err) {

        // Disconnect to database
        await mongoose.disconnect();

        console.error(err.message);
        res.send({
            data: [],
            message: err.message,
            code: 400
        });

    }

};

/**
 * Get all tasks from backoffice.
 * @param {*} req 
 * @param {*} res 
 */
exports.readAllFromBackOffice = async (req, res) => {

    try {

        // Connect to database
        await mongoose.connect(process.env.DB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Get all tasks
        let tasks = await Task.find({
            _deletedAt: null,
        }).select("-audios -completeWordAudio");

        // Disconnect to database
        await mongoose.disconnect();

        console.info('Tasks returned successfully');
        res.send({
            data: tasks,
            message: 'Tasks returned successfully',
            code: 200
        });

    } catch (err) {

        // Disconnect to database
        await mongoose.disconnect();

        console.error(err.message);
        res.send({
            data: [],
            message: err.message,
            code: 400
        });

    }

};

/**
 * Update a task.
 * @param {*} req 
 * @param {*} res 
 */
exports.update = async (req, res) => {

    try {

        // Connect to database
        await mongoose.connect(process.env.DB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Update task data
        const data = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Disconnect to database
        await mongoose.disconnect();

        console.info('Task updated successfuly');
        res.send({
            data: data,
            message: 'Task updated successfuly',
            code: 200
        });

    } catch (err) {

        // Disconnect to database
        await mongoose.disconnect();

        console.error(err.message);
        res.send({
            data: [],
            message: err.message,
            code: 400
        });

    }

};

/**
 * Delete a task.
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = async (req, res) => {

    try {

        // Connect to database
        await mongoose.connect(process.env.DB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        await Task.findByIdAndDelete(req.params.id);

        // Disconnect to database
        await mongoose.disconnect();

        console.info('Task deleted successfuly');
        res.send({
            data: {},
            message: 'Task deleted successfuly',
            code: 200
        });

    } catch (err) {

        // Disconnect to database
        await mongoose.disconnect();

        console.error(err.message);
        res.send({
            data: [],
            message: err.message,
            code: 400
        });

    }

};