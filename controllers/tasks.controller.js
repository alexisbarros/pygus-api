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
            image: req.file.path,
            syllables: JSON.parse(req.body.syllables)
        });
    
        // Disconnect to database
        await mongoose.disconnect();

        // Create task data to return
        let taskToFront = {
            _id: task._id,
            _createdAt: task._createdAt,
            name: task.name,
            image: task.image,
            syllables: task.syllables
        };
        
        console.info('Task created successfuly');
        res.send({
            data: taskToFront,
            message: 'Task created successfuly',
            code: 200
        });

    } catch(err) {

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
        let task = await Task.findById(req.params.id);
        
        // Check if task was removed
        if(task._deletedAt) throw { message: 'Task removed' };

        // Create task data to return
        let taskToFront = {
            _id: task._id,
            _createdAt: task._createdAt,
            name: task.name,
            image: task.image,
            syllables: task.syllables
        };
        
        // Disconnect to database
        await mongoose.disconnect();
        
        console.info('Task returned successfully');
        res.send({
            data: taskToFront,
            message: 'Task returned successfully',
            code: 200
        });

    } catch(err) {

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
        let tasks = await Task.find({});

        // Filter task tha wasnt removed
        let tasksToFront = tasks.filter(task => !task._deletedAt);

        // Create task data to return
        tasksToFront = tasksToFront.map(task => {
            return {
                _id: task._id,
                _createdAt: task._createdAt,
                name: task.name,
                images: task.images,
                syllables: task.syllables
            };
        });
        
        // Disconnect to database
        await mongoose.disconnect();
        
        console.info('Tasks returned successfully');
        res.send({
            data: tasksToFront,
            message: 'Tasks returned successfully',
            code: 200
        });

    } catch(err) {

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
        let task = await Task.findByIdAndUpdate(req.params.id, { ...req.body });
    
        // Disconnect to database
        await mongoose.disconnect();

        // Create task data to return
        let taskToFront = {
            _id: task._id,
            _createdAt: task._createdAt,
            name: task.name,
            image: task.imagem,
            syllables: task.syllables
        };
        
        console.info('Task updated successfuly');
        res.send({
            data: taskToFront,
            message: 'Task updated successfuly',
            code: 200
        });

    } catch(err) {

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
        await Task.findByIdAndUpdate(req.params.id, { _deletedAt: Date.now() });
    
        // Disconnect to database
        await mongoose.disconnect();
    
        console.info('Task deleted successfuly');
        res.send({
            data: {},
            message: 'Task deleted successfuly',
            code: 200
        });
        
    } catch(err) {

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