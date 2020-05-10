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
            _id: String,
            messageType: String,
            from: {
                userId: String,
                username: String
            },
            message: String,
            time: Number,
            readBy: [{
                _id: false,
                userId: String,
                username: String
            }]
        }]
    }],
});

const Conversation = mongoose.model('conversations', conversationSchema);

module.exports = Conversation;