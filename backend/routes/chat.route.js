const express = require('express');
const router = express.Router();

const { 
    getAllUserChannels, 
    addNewChannel, 
    addNewMessage, 
    getAllChannels, 
    joinChannel,
    leaveChannel,
    starChannel,
    getUnreadChannelMessages,
    getChannelInfo,
    readChannelMessages
} = require('../helper/channel.js');

/* Get channels of a user and display them on the side bar */
router.route('/users/:userId/channels').get(async (req, res) => {

    await getAllUserChannels(req, res);

});

/* Get a specific channel clicked by user on the side bar and display all infomation of the channel */
router.route('/channels/:channelId').get(async (req, res) => {
    const foundChannel = await getChannelInfo(req, res);
    if (!foundChannel) {
        return res.status(404).json({ message: 'Channel not found' });
    }
    res.status(200).json(foundChannel);

});

/* Create a new channel */
router.route('/channels/add').post(async (req, res) => {

    await addNewChannel(req, res);

});

/* Save new message into db */
router.route('/channels/:channelId/messages/new-message').post(async (req, res) => {

    await addNewMessage(req, res);

});

/* Get all available channels */
router.route('/channels').get(async (req, res) => {

    await getAllChannels(req, res);
    
});

/* When user joins a channel */
router.route('/channels/:channelId/join').put(async (req, res) => {

    await joinChannel(req, res);

});

/* When user leaves a channel */
router.route('/channels/:channelId/users/:userId/leave').delete(async (req, res) => {

    await leaveChannel(req, res);

});

router.route('/channels/:channelId/users/:userId/star').put(async (req, res) => {

    await starChannel(req, res);

});

router.route('/channels/:channelId/read-by/:userId').get(async (req, res) => {

    await getUnreadChannelMessages(req, res);

});

router.route('/channels/:channelId/read-by/:userId').post(async (req, res) => {

    await readChannelMessages(req, res);

});

module.exports = router;