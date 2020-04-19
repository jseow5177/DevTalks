const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const channelSchema = new Schema({
    channelId: String,
    channelName: String,
    owner: {
        userId: String,
        username: String
    },
    description: String,
    members: [{
        userId: String,
        username: String
    }],
    messages: [{
        from: {
            userId: String,
            username: String
        },
        message: String
    }]
});

const Channel = mongoose.model('channels', channelSchema);

module.exports = Channel;