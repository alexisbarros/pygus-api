// Modules
const express = require('express');

const router = express.Router();

// Controllers
const tasks_controllers = require('../controllers/tasks.controller');

router.get('/', tasks_controllers.readAll);
router.get('/:id', tasks_controllers.readOne);
router.post('/', tasks_controllers.uploadImg, tasks_controllers.create);
router.put('/audios/:id', tasks_controllers.uploadAudio, tasks_controllers.update);
router.put('/:id', tasks_controllers.update);
router.delete('/:id', tasks_controllers.delete);

module.exports = router;