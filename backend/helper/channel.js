const getDate = require('./date');
const { findUser } = require('./user');

// Channel Model
const Channel = require('../models/Channel');
const User = require('../models/User');

const getAllUserChannels = async (req, res) => {

    // const userId = req.params.userId;

    try {
        const foundUser = await findUser(req, res, byId = true);

        return res.status(200).json(foundUser.channels);

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

    const channelInfo = req.body.channelData; // channelId, channelName, channelDescription
    const userInfo = req.body.userData; // userId, username

    try {
        /* Find logged in user and add this channel to the user's list of channels */
        const foundUser = await findUser(req, res, byId = false);

        const joinedChannels = foundUser.channels;
        joinedChannels.push({
            channelId: channelInfo.channelId,
            channelName: channelInfo.channelName,
            starred: false
        });
        await foundUser.save(err => {
            if (err) console.log(err);
        });

        /* Add this new channel to the collection of channels */
        const newChannel = new Channel({
            ...channelInfo,
            messages: [], // No messages yet
            owner: userInfo,
            members: [userInfo], // The first member is the owner
            noOfMembers: 1, // One new member
            stars: 0 // No stars
        })
        await newChannel.save(err => {
            if (err) console.log(err);
        });

        /* Return the new channel list of user */
        return res.status(200).json(joinedChannels);

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }

}

const addNewMessage = async (req, res) => {

    const newMessage = req.body;

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

        if (allChannels) {
            return res.status(200).json(allChannels);
        } else {
            return res.status(404).json('No channels exist');
        }

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}

const joinChannel = async (req, res) => {

    const userInfo = req.body; // userId and username

    try {

        // Add new user to channel members
        const foundChannel = await getChannelInfo(req, res);
        const channelMembers = foundChannel.members;
        foundChannel.noOfMembers++;
        channelMembers.push(userInfo.userData);
        await foundChannel.save(err => {
            if (err) console.log(err);
        });

        // Add channel to user's list of channels
        const channelData = {
            channelId: foundChannel.channelId,
            channelName: foundChannel.channelName,
            starred: false
        }
        const foundUser = await findUser(req, res, byId = false);

        const userChannels = foundUser.channels;
        userChannels.push(channelData);
        await foundUser.save(err => {
            if (err) console.log(err);
        });

        return res.status(200).json({ message: 'Successfully joined channel!' });

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
        await Channel.findOneAndUpdate({ channelId: channelId }, {
            $inc:{
                noOfMembers: -1,
                stars: decrease
            },
            $pull: {
                members: {userId: userId}
            }
        });

        // Remove channel from user's list of channels
        await User.findOneAndUpdate({ _id: userId }, {$pull: {channels: {channelId: channelId}}});

        return res.status(200).json({ message: 'Successfully left channel!' });

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

}

const starChannel = async (req, res) => {

    const channelId = req.params.channelId;
    const userId = req.params.userId;
    const starred = req.query.starred;

    try {

        let change;
        starred ==='true' ? change = -1 : change = 1;

        // Increase or decrease the number of channel stars
        await Channel.findOneAndUpdate({channelId: channelId}, {$inc: {stars: change}});

        // Change starred field of user channel
        await User.findOneAndUpdate({_id: userId, "channels.channelId": channelId}, {$set: {"channels.$.starred": !starred}});

        return res.status(200).json({message: 'Star toggled'});

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}

module.exports = { getAllUserChannels, getChannelInfo, addNewChannel, addNewMessage, getAllChannels, joinChannel, leaveChannel, starChannel }