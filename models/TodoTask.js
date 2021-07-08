const mongoose = require('mongoose');

const todoTaskSchema = new mongoose.Schema({
    content: {
    type: String,
    required: true
    },
    date: {
    type: Date,
    default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.String,ref: 'User'
      }
});


module.exports = mongoose.model('TodoTask',todoTaskSchema);