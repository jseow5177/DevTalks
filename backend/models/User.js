const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    channels: [{
        _id: false,
        channelId: String,
        channelName: String
    }],
    starred: [{
        _id: false,
        channelId: String,
        channelName: String
    }]
});

const User = mongoose.model('users', userSchema);

module.exports = User;