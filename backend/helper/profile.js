const getDate = require('./date');

const User = require('../models/User');
const Conversation = require('../models/Conversation');

const { v1: uuidv1 } = require('uuid');

const { findUser } = require('./user');

const checkFriendStatus = async (req, res) => {
    const profileId = req.params.profileId;

    try {

        const foundUser = await findUser(req, res, byId = true);
        const userFriends = foundUser.friends;
        const friendProfile = userFriends.find(userFriend => userFriend.userId === profileId);

        if (!friendProfile) {
            return res.status(200).json({ status: 'stranger' });
        } else {
            return res.status(200).json({ status: friendProfile.status });
        }

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}

const sendFriendRequest = async (req, res) => {

    const userId = req.params.userId;
    const profileId = req.params.profileId;
    const userData = req.body.userData;
    const profileData = req.body.profileData;

    try {

        // Add request to user's pending request
        await User.findOneAndUpdate({ _id: userId }, { $push: { pending_requests: profileData } });

        // Add request to profile's friend request
        await User.findOneAndUpdate({ _id: profileId }, { $push: { friend_requests: userData } });

        return res.status(200).json({ status: 'pending-request' });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}

const acceptFriendRequest = async (req, res) => {

    const userId = req.params.userId;
    const profileId = req.params.profileId;
    const userData = req.body.userData;
    const profileData = req.body.profileData;

    try {

        const conversationId = uuidv1();

        // Create a Conversation
        const newConversation = new Conversation({
            conversationId: conversationId,
            members: [userData, profileData],
            messagesByDate: []
        });

        await newConversation.save();

        await User.findOneAndUpdate({ _id: userId }, { $push: { friends: profileData, conversations: conversationId }, $pull: { friend_requests: profileData } });

        await User.findOneAndUpdate({ _id: profileId }, { $push: { friends: userData, conversations: conversationId }, $pull: { pending_requests: userData } });

        return res.status(200).json({ status: 'friend' });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}

const cancelFriendRequest = async (req, res) => {

    const userId = req.params.userId;
    const profileId = req.params.profileId;

    try {

        await User.findOneAndUpdate({ _id: userId }, { $pull: { 'pending_requests': { userId: profileId } } });

        await User.findOneAndUpdate({ _id: profileId }, { $pull: { 'friend_requests': { userId: userId } } });

        return res.status(200).json({ status: 'stranger' });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}

const rejectFriendRequest = async (req, res) => {

    const userId = req.params.userId;
    const profileId = req.params.profileId;

    try {

        await User.findOneAndUpdate({ _id: userId }, { $pull: { 'friend_requests': { userId: profileId } } });

        await User.findOneAndUpdate({ _id: profileId }, { $pull: { 'pending_requests': { userId: userId } } });

        return res.status(200).json({ status: 'stranger' });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}

const unfriend = async (req, res) => {

    const userId = req.params.userId;
    const profileId = req.params.profileId;

    try {

        const deletedConversation = await Conversation.findOneAndDelete({ members: { $elemMatch: { userId: userId, userId: profileId } } });

        await User.findOneAndUpdate({ _id: userId }, { $pull: { 'friends': { userId: profileId }, 'conversations': deletedConversation.conversationId } });

        await User.findOneAndUpdate({ _id: profileId }, { $pull: { 'friends': { userId: userId }, 'conversations': deletedConversation.conversationId } });

        return res.status(200).json({ status: 'stranger' });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}

const getFriends = async (req, res) => {

    const userId = req.params.userId;

    try {

        const userFriends = await User.findOne({ _id: userId }, { _id: 0, friends: 1 });

        return res.status(200).json(userFriends.friends);

    } catch (err) {
        return res.status(500).json({ message: 'Error in getting user friends', error: err.message });
    }

}

const getFriendRequests = async (req, res) => {

    const userId = req.params.userId;

    try {

        const userFriendRequests = await User.findOne({ _id: userId }, { _id: 0, friend_requests: 1 });

        return res.status(200).json(userFriendRequests.friend_requests);

    } catch (err) {
        return res.status(500).json({ message: 'Error in getting user friend requests', error: err.message });
    }

}

const getPendingRequests = async (req, res) => {

    const userId = req.params.userId;

    try {

        const userPendingRequests = await User.findOne({ _id: userId }, { _id: 0, pending_requests: 1 });

        return res.status(200).json(userPendingRequests.pending_requests);

    } catch (err) {
        return res.status(500).json({ message: 'Error in getting user pending requests', error: err.message });
    }

}

const getConversations = async (req, res) => {

    const userId = req.params.userId;

    try {

        const userConversations = await User.findOne({ _id: userId }, { _id: 0, conversations: 1 });

        return res.status(200).json(userConversations.conversations);

    } catch (err) {
        return res.status(500).json({ message: 'Error in getting user conversations', error: err.message });
    }

}

const getConversation = async (req, res) => {

    const userId = req.params.userId;
    const profileId = req.params.profileId;

    try {

        const userConversation = await Conversation.findOne({ 'members.userId': userId, 'members.userId': profileId });
        return res.status(200).json(userConversation);

    } catch (err) {
        return res.status(500).json({ message: 'Error in getting user conversation', error: err.message });
    }

}

const addNewMessage = async (req, res) => {

    const newMessage = req.body;
    const conversationId = req.params.conversationId;

    // Create date where message is sent 
    const date = getDate(new Date(req.body.time));

    const foundConversation = await Conversation.findOne({ conversationId: conversationId });
    const conversationMessages = foundConversation.messagesByDate; // Get conversation's existing messages

    // Find if there is a group of messages with the same date as above
    const messagesGroupedByDate = conversationMessages.find(conversationMessagesByDate => conversationMessagesByDate.date === date);

    if (messagesGroupedByDate) { // If yes, add the new message to that group
        messagesGroupedByDate.messages.push(newMessage);
    } else { // If no, create a new group of messages with that date (deal with corner case where the message is new for the day)
        const newMessagesGroupedByDate = {
            date: date,
            messages: [newMessage]
        }
        conversationMessages.push(newMessagesGroupedByDate);
    }

    try {
        await foundConversation.save(err => {
            if (err) console.log(err);
        });
        return res.status(200).json({ message: 'Message sent' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}

module.exports = {
    checkFriendStatus,
    sendFriendRequest,
    acceptFriendRequest,
    cancelFriendRequest,
    rejectFriendRequest,
    unfriend,
    getFriends,
    getFriendRequests,
    getPendingRequests,
    getConversations,
    getConversation,
    addNewMessage
};