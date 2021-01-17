// Modules
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Schema
const TaskSchema = new Schema({

    name: {
        type: String,
        required: true,
    },
    
    image: {
        type: String,
        required: true
    },

    syllables: {
        type: Array,
        required: true
    },

    audios: {
        type: String,
        required: false
    },

    _createdAt: { 
        type: Date,
        required: true,
        default: () => {
            if(!this._createdAt) {            
                return Date.now();
            }
        },
    },

    _updatedAt: { 
        type: Date,
        required: true,
        default: () => {
            if(!this._updatedAt) {            
                return Date.now();
            }
        },
    },

    _deletedAt: {
        type: Date,
        required: false,
        default: null
    },

});

module.exports = mongoose.model('Task', TaskSchema);