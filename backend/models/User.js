const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    bio: String,
    channels: [{
        _id: false,
        channelId: String,
        channelName: String,
        starred: Boolean,
    }],
    conversations: [String], // Store conversationIds
    friends: [{
        _id: false,
        userId: String,
        username: String,
        status: String
    }],
    // Users who sent you requests
    friend_requests: [{
        _id: false,
        userId: String,
        username: String,
        // isRead: Boolean // Implement a simple notification feature
    }],
    // Users who you have sent requests
    pending_requests: [{
        _id: false,
        userId: String,
        username: String
    }]
});

const User = mongoose.model('users', userSchema);

module.exports = User;