// Modules
const mongoose = require('mongoose');
const fs = require('fs');
const multer = require('multer');

// Model
const Task = require('../models/tasks.model');

/**
 * Method to save image in server
 */
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, './public/tasks_images');
    },

    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
exports.uploadImg = multer({ storage: storage }).single('image');

/**
 * Method to audios image in server
 */
const storage_audio = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/tasks_audios');
    },

    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
exports.uploadAudio = multer({ storage: storage_audio }).array('audios');

/**
 * Method to save audio in server
 */
const storage_complete_word_audio = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/task_audios');
    },

    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
exports.uploadCompleteWordAudio = multer({ storage: storage_complete_word_audio }).single('audio');

/**
 * Register task in db.
 * @param {*} req 
 * @param {*} res 
 */
exports.create = async (req, res) => {

    try {
        console.log(req.body);
        // Connect to database
        await mongoose.connect(process.env.DB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Create image buffer to put in mongod
        // let image = {
        //     data: fs.readFileSync(req.file.path),
        //     type: req.file.mimetype
        // }

        // Create task in database
        let task = await Task.create({
            name: req.body.name,
            // image: image,
            // imageType: req.file.mimetype,
            syllables: JSON.parse(req.body.syllables),
            phoneme: req.body.phoneme,
        });

        // Disconnect to database
        await mongoose.disconnect();

        // Create task data to return
        let taskToFront = {
            _id: task._id,
            _createdAt: task._createdAt,
            name: task.name,
            // image: task.image,
            // imageType: task.imageType,
            syllables: task.syllables,
            phoneme: task.phoneme,
            // audios: task.audios
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
        let image = `http://191.101.18.67:3000/public/tasks_images/${task.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()}.png`;

        // Create task data to return
        let taskToFront = {
            _id: task._id,
            _createdAt: task._createdAt,
            name: task.name,
            image: image,
            imageType: task.imageType,
            syllables: task.syllables,
            audios: task.audios,
            completeWordAudio: task.completeWordAudio,
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

        let formUpdated = { ...req.body };

        // Create image buffer to put in mongod
        // if (req.file) {
        //     let image = {
        //         data: fs.readFileSync(req.file.path),
        //         type: req.file.mimetype
        //     }
        //     formUpdated['image'] = image;
        // }
        formUpdated['syllables'] = JSON.parse(formUpdated.syllables);
        formUpdated['phoneme'] = formUpdated.phoneme;

        // Update task data
        let task = await Task.findByIdAndUpdate(req.params.id, formUpdated);

        // Disconnect to database
        await mongoose.disconnect();

        // Create task data to return
        let taskToFront = {
            _id: task._id,
            _createdAt: task._createdAt,
            name: task.name,
            image: task.imagem,
            imageType: task.imageType,
            syllables: task.syllables,
            audios: task.audios,
            completeWordAudio: task.completeWordAudio,
            phoneme: task.phoneme,
        };

        console.info('Task updated successfuly');
        res.send({
            data: taskToFront,
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
 * Update a task.
 * @param {*} req 
 * @param {*} res 
 */
exports.updateAudio = async (req, res) => {

    try {

        // Connect to database
        await mongoose.connect(process.env.DB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        let formUpdated = { ...req.body };

        // Get audios
        if (req.files) {
            // Create audios buffer to put in mongod
            let audios = [];
            for (audio of req.files) {
                audios.push({
                    data: fs.readFileSync(audio.path),
                    type: audio.mimetype
                });
            };
            formUpdated['audios'] = audios;
        }

        // Update task data
        let task = await Task.findByIdAndUpdate(req.params.id, formUpdated);

        // Disconnect to database
        await mongoose.disconnect();

        // Create task data to return
        let taskToFront = {
            _id: task._id,
            _createdAt: task._createdAt,
            name: task.name,
            image: task.imagem,
            imageType: task.imageType,
            syllables: task.syllables,
            audios: task.audios,
            completeWordAudio: task.completeWordAudio,
            phoneme: task.phoneme,
        };

        console.info('Task updated successfuly');
        res.send({
            data: taskToFront,
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
 * Update a task.
 * @param {*} req 
 * @param {*} res 
 */
exports.updateCompleteAudio = async (req, res) => {

    try {

        // Connect to database
        await mongoose.connect(process.env.DB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        let formUpdated = { ...req.body };

        // Get audios
        if (req.file) {
            let audio = {
                data: fs.readFileSync(req.file.path),
                type: req.file.mimetype
            }
            formUpdated['completeWordAudio'] = audio;
        }

        // Update task data
        let task = await Task.findByIdAndUpdate(req.params.id, formUpdated);

        // Disconnect to database
        await mongoose.disconnect();

        // Create task data to return
        let taskToFront = {
            _id: task._id,
            _createdAt: task._createdAt,
            name: task.name,
            image: task.imagem,
            imageType: task.imageType,
            syllables: task.syllables,
            audios: task.audios,
            completeWordAudio: task.completeWordAudio,
            phoneme: task.phoneme,
        };

        console.info('Task updated successfuly');
        res.send({
            data: taskToFront,
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

        // Delete task by id
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