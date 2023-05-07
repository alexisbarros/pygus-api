// Modules
const express = require('express');

const router = express.Router();

// Controllers
const tasks_controllers = require('../controllers/tasks.controller');

router.get('/', tasks_controllers.readAll);
router.get('/backoffice', tasks_controllers.readAllFromBackOffice);
router.get('/:id', tasks_controllers.readOne);
router.post('/', tasks_controllers.create);
router.put('/:id', tasks_controllers.update);
router.delete('/:id', tasks_controllers.delete);

router.post('/upload/image', tasks_controllers.uploadImg, async (req, res) => res.send({ code: 200 }));
router.post('/upload/audio', tasks_controllers.uploadCompleteWordAudio, async (req, res) => res.send({code: 200}));
router.post('/upload/audios', tasks_controllers.uploadAudio, async (req, res) => res.send({code: 200}));

module.exports = router;