const express = require('express');
const router = express.Router();

// Temporary storage for development. DB not set up yet
const users = [];
const channels = [];

// Default user for testing and development
const defaultUser = {
    userId: '001',
    username: 'Jonathan',
    channels: [],
    starred: []
}
users.push(defaultUser);

/* Get channels of a user and display them on the side bar */
router.route('/channels').get(async (req, res) => {

    // ---->> Get channels of user <<---- //
    const foundUser = users.find(user => user.userId === '001');
    const joinedChannels = foundUser.channels;
    const starredChannels = foundUser.starred;
    
    const channels = {
        joinedChannels: joinedChannels,
        starredChannels: starredChannels
    }
    return res.status(200).json(channels);
    
});

/* Get a specific channel clicked by user on the side bar and display all infomation of the channel */
router.route('/channels/:channelId').get(async (req, res) => {

    const channelId = req.params.channelId;
    const foundChannel = channels.find(channel => channel.channelId === channelId);
    return res.status(200).json(foundChannel);

});

router.route('/channels/add').post(async (req, res) => {

    const newChannel = req.body; // channelId, channelName, channelDescription
    const foundUser = users.find(user => user.userId === '001');

    const userInfo = {
        userId: foundUser.userId,
        username: foundUser.username
    }

    // ---->> Step 1: Find logged in user and add this room to him or her <<---- //
    const joinedChannels = foundUser.channels;
    joinedChannels.push({
        channelId: newChannel.channelId,
        channelName: newChannel.channelName
    });

    // ---->> Step 2: Add this new channel to the collection of channels <<---- //
    newChannel.messages = []; // No messages yet
    newChannel.owner = userInfo;
    newChannel.members = [userInfo]; // The first member is the owner
    newChannel.noOfMembers = 1; // One new member
    channels.push(newChannel);

    return res.status(200).json(joinedChannels);
    //return res.status(500).json({message: error.message});
});

module.exports =  router;