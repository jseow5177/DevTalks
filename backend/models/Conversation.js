const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
    conversationId: String,
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
            messageType: String,
            from: {
                userId: String,
                username: String
            },
            message: String,
            time: Number
        }]
    }],
});

const Conversation = mongoose.model('conversations', conversationSchema);

module.exports = Conversation;