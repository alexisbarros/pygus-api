// Modules
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SyllableSchema = new Schema({

    syllable: {
        type: String,
        required: true,
    },

    isPhoneme: {
        type: Boolean,
        required: false,
        default: false,
    },

});

// Schema
const TaskSchema = new Schema({

    name: {
        type: String,
        required: true,
    },

    image: {
        data: Buffer,
        contentType: String,
    },

    imageType: {
        type: String,
        required: false
    },

    syllables: [
        SyllableSchema
    ],

    audios: {
        data: Buffer,
        contentType: Array,
    },

    _createdAt: {
        type: Date,
        required: true,
        default: () => {
            if (!this._createdAt) {
                return Date.now();
            }
        },
    },

    _updatedAt: {
        type: Date,
        required: true,
        default: () => {
            if (!this._updatedAt) {
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