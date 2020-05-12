const express = require('express');
const router = express.Router();

const {
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
    addNewMessage,
    getUnreadPrivateMessages,
    readPrivateMessages
} = require('../helper/profile');

// Check if user is a friend of the selected profile
router.route('/users/:userId/friends/:profileId').get(async (req, res) => {

    await checkFriendStatus(req, res);

});

router.route('/users/:userId/send-friend-request/:profileId').put(async (req, res) => {

    await sendFriendRequest(req, res);

});

router.route('/users/:userId/accept-friend-request/:profileId').put(async (req, res) => {

    await acceptFriendRequest(req, res);

});

router.route('/users/:userId/cancel-friend-request/:profileId').delete(async (req, res) => {

    await cancelFriendRequest(req, res);

});

router.route('/users/:userId/reject-friend-request/:profileId').delete(async (req, res) => {

    await rejectFriendRequest(req, res);

});

router.route('/users/:userId/unfriend/:profileId').delete(async (req, res) => {

    await unfriend(req, res);

});

router.route('/users/:userId/friends').get(async (req, res) => {

    await getFriends(req, res);

});

router.route('/users/:userId/friend-requests').get(async (req, res) => {

    await getFriendRequests(req, res);

});

router.route('/users/:userId/pending-requests').get(async (req, res) => {

    await getPendingRequests(req, res);

});

router.route('/users/:userId/conversations').get(async (req, res) => {

    await getConversations(req, res);

});

router.route('/users/:userId/conversation/:profileId').get(async (req, res) => {

    await getConversation(req, res);

});

router.route('/conversations/:conversationId/messages/new-message').post(async (req, res) => {

    await addNewMessage(req, res);

});

router.route('/conversations/:profileId/read-by/:userId').get(async (req, res) => {

    await getUnreadPrivateMessages(req, res);

});

router.route('/conversations/:id/read-by/:userId').post(async (req, res) => {

    await readPrivateMessages(req, res);

});

module.exports = router;