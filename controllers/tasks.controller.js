const mongoose = require('mongoose');
const fs = require('fs');
const multer = require('multer');

const TaskModel = require('../models/tasks.model');
const Task = require('../domain/entities/task.model');
const { getFileUrl } = require('../services/cloud-storage.service');
const { standardizeText } =  require('../utils/string.util');

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

        // Create task in database
        let task = await TaskModel.create({
            name: req.body.name,
            syllables: req.body.syllables,
            phoneme: req.body.phoneme,
        });

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

        const data = await TaskModel
            .findById(req.params.id);
        
        let task = new Task(data);
        
        task.imgUrl = await getFileUrl(
            'tasks_images', 
            `${standardizeText(task.name)}.png`,
        );

        task.audioUrl = await getFileUrl(
            'tasks_complete_audios', 
            `${standardizeText(task.name)}.mp3`,
        );

        await Promise.all(
            task.syllables.map(async (syllable) => {
                syllable.audioUrl = await getFileUrl(
                    `tasks_audios/${standardizeText(task.name)}`, 
                    `${standardizeText(syllable.syllable)}.mp3`
                );
                return syllable;

            })
        );

        console.info('Task returned successfully');
        res.send({
            data: new Task(task),
            message: 'Task returned successfully',
            code: 200
        });

    } catch (err) {

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

        const tasks = (await TaskModel
            .find())
            .map(data => new Task(data));

        const phonemes = [
            ...new Set(
                tasks.map((el) => el['phoneme'])
            ),
        ]

        // Create list of all tasks by phoneme
        let tasksByPhoneme = [];
        for (const phoneme of phonemes) {
            const tasksBySinglePhoneme = tasks
                .filter((task) => task.phoneme === phoneme);

            tasksByPhoneme.push({
                'phoneme': phoneme,
                'tasks': tasksBySinglePhoneme,
            });
        }

        console.info('Tasks returned successfully');
        res.send({
            data: tasksByPhoneme,
            message: 'Tasks returned successfully',
            code: 200
        });

    } catch (err) {

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

        // Get all tasks
        let tasks = await TaskModel.find({
            _deletedAt: null,
        }).select("-audios -completeWordAudio");

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

        // Update task data
        const data = await TaskModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

        console.info('Task updated successfuly');
        res.send({
            data: data,
            message: 'Task updated successfuly',
            code: 200
        });

    } catch (err) {

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

        await TaskModel.findByIdAndDelete(req.params.id);

        console.info('Task deleted successfuly');
        res.send({
            data: {},
            message: 'Task deleted successfuly',
            code: 200
        });

    } catch (err) {

        console.error(err.message);
        res.send({
            data: [],
            message: err.message,
            code: 400
        });

    }

};