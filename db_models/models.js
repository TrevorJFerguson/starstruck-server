const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true
    },
    beenStarred: {
        type: Boolean,
        required: true,
        default: false
    },
    dateTime: {
        type: Date,
        required: true,
        default: new Date
    }
})

const Link = mongoose.model('Link', linkSchema)

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    repos: {
        type: Array,
        required: true,
        default: []
    }
})

const User = mongoose.model('User', userSchema)

module.exports = {
    User,
    Link
  };