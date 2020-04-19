const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    channels: [{
        channelId: String,
        channelName: String
    }],
    starred: [{
        channelId: String,
        channelName: String
    }]
});

const User = mongoose.model('users', userSchema);

module.exports = User;