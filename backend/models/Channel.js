const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const channelSchema = new Schema({
    channelId: String,
    channelName: String,
    owner: {
        userId: String,
        username: String
    },
    channelDescription: String,
    members: [{
        _id: false,
        userId: String,
        username: String
    }],
    messagesByDate: [{
        _id: false,
        date: String,
        messages: [{
            _id: false,
            from: {
                userId: String,
                username: String
            },
            message: String,
            time: Number
        }]
    }],
    noOfMembers: Number,
    stars: Number
});

const Channel = mongoose.model('channels', channelSchema);

module.exports = Channel;