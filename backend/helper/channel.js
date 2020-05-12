const { v1: uuidv1 } = require('uuid');

const getDate = require('./date');

// Channel Model
const Channel = require('../models/Channel');
const User = require('../models/User');

const getAllUserChannels = async (req, res) => {

    const userId = req.params.userId;

    try {
        const foundChannels = await User.findOne({ _id: userId }, { _id: 0, channels: 1 });
        return res.status(200).json(foundChannels.channels);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}

const getChannelInfo = async (req, res) => {

    const channelId = req.params.channelId;

    try {
        const foundChannel = await Channel.findOne({ channelId: channelId });
        return foundChannel;
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}

const addNewChannel = async (req, res) => {

    const channelData = req.body.channelData;
    const userData = req.body.userData;

    try {

        /* Find logged in user and add this channel to the user's list of channels */
        const updatedUser = await User.findOneAndUpdate({ _id: userData.userId }, {
            $push: {
                channels: {
                    channelId: channelData.channelId,
                    channelName: channelData.channelName,
                    starred: false
                }
            }
        }, { new: true });

        /* Add this new channel to the collection of channels */
        const newChannel = new Channel(channelData);
        await newChannel.save(err => {
            if (err) console.log(err);
        });

        /* Return the new channel list of user */
        return res.status(200).json(updatedUser.channels);

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }

}

const addNewMessage = async (req, res) => {

    const newMessage = req.body;
    //newMessage._id = uuidv1();

    // Create date where message is sent 
    const date = getDate(new Date(req.body.time));

    const foundChannel = await getChannelInfo(req, res);
    const channelMessages = foundChannel.messagesByDate; // Get channel's existing messages

    // Find if there is a group of messages with the same date as above
    const messagesGroupedByDate = channelMessages.find(channelMessagesByDate => channelMessagesByDate.date === date);

    if (messagesGroupedByDate) { // If yes, add the new message to that group
        messagesGroupedByDate.messages.push(newMessage);
    } else { // If no, create a new group of messages with that date (deal with corner case where the message is new for the day)
        const newMessagesGroupedByDate = {
            date: date,
            messages: [newMessage]
        }
        channelMessages.push(newMessagesGroupedByDate);
    }

    try {
        await foundChannel.save(err => {
            if (err) console.log(err);
        });
        return res.status(200).json({ message: 'Message sent' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}

const getAllChannels = async (req, res) => {

    try {
        const allChannels = await Channel.find();
        return res.status(200).json(allChannels);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}

const joinChannel = async (req, res) => {

    const userData = req.body.userData; // userId and username
    const channelData = req.body.channelData; // channelId and channelName
    const channelId = req.params.channelId;

    try {

        // Add new user to channel members
        await Channel.findOneAndUpdate({ channelId: channelId }, { $push: { members: userData }, $inc: { noOfMembers: 1 } });

        // Set user to read all messages
        const foundChannel = await Channel.findOne({ channelId: channelId });

        const messagesByDate = foundChannel.messagesByDate;

        // Find messages not read by user
        messagesByDate.forEach(messageByDate => {
            const messages = messageByDate.messages;
            messages.forEach(message => {
                message.readBy.push(userData);
            });
        });

        await foundChannel.save();

        // Add channel to user's list of channels
        await User.findOneAndUpdate({ _id: userData.userId }, { $push: { channels: channelData } });

        return res.status(200).json(channelData);

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

}

const leaveChannel = async (req, res) => {

    const channelId = req.params.channelId;
    const userId = req.params.userId;
    const starred = req.query.starred;

    try {

        // Remove user from channel members        
        let decrease;
        starred === 'true' ? decrease = -1 : decrease = 0;
        await Channel.findOneAndUpdate({ channelId: channelId }, { $inc: { noOfMembers: -1, stars: decrease }, $pull: { members: { userId: userId } } });

        // Remove channel from user's list of channels
        await User.findOneAndUpdate({ _id: userId }, { $pull: { channels: { channelId: channelId } } });

        return res.status(200).json({ message: 'Successfully left channel!' });

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

}

const starChannel = async (req, res) => {

    const channelId = req.params.channelId;
    const userId = req.params.userId;
    let starred = req.query.starred;

    try {

        let change;
        starred === 'true' ? change = -1 : change = 1;

        starred = (starred === 'true'); // Convert to Boolean

        // Increase or decrease the number of channel stars
        await Channel.findOneAndUpdate({ channelId: channelId }, { $inc: { stars: change } });

        // Change starred field of user channel
        await User.findOneAndUpdate({ _id: userId, "channels.channelId": channelId }, { $set: { "channels.$.starred": !starred } });

        return res.status(200).json({ message: 'Star toggled' });

    } catch (err) {
        return res.status(500).json({ message: 'Error in toggling channel star', error: err.message });
    }

}

const getUnreadChannelMessages = async (req, res) => {

    const channelId = req.params.channelId;
    const userId = req.params.userId;

    let unreadMessages = [];
    let unreadCount = 0;

    try {

        const foundChannel = await Channel.findOne({ channelId: channelId });

        const messagesByDate = foundChannel.messagesByDate;

        // Find messages not read by user
        messagesByDate.forEach(messageByDate => {
            const messages = messageByDate.messages;
            messages.forEach(message => {
                const readBy = message.readBy;
                const user = readBy.find(user => user.userId === userId);
                if (!user) {
                    unreadMessages.push(message._id);
                    unreadCount++;
                }
            })

        });

        return res.status(200).json({ unreadMessages: unreadMessages, unreadCount: unreadCount });

    } catch (err) {
        return res.status(500).json({ message: 'Error in getting channel read-by', error: err.message });
    }

}

const readChannelMessages = async (req, res) => {

    const channelId = req.params.channelId;
    const readMessages = req.body.readMessages;
    const userData = req.body.userData;

    try {

        const foundChannel = await Channel.findOne({ channelId: channelId });

        // This could be better optimized
        for (let messageId of readMessages) {

            for (messagesByDate of foundChannel.messagesByDate) {

                const messages = messagesByDate.messages;
                const foundMessageIndex = messages.findIndex(message => message._id === messageId);

                if (foundMessageIndex !== -1) {
                    messages[foundMessageIndex].readBy.push(userData);
                    //continue; // Continue to next loop if message is already found
                }

            }

        }

        await foundChannel.save();

        return res.status(200).json({ message: 'Messages read!' });

    } catch (err) {
        return res.status(500).json({ message: 'Error in reading channel messages', error: err.message });
    }

}

module.exports = {
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
}