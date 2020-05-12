import axios from 'axios';

// Send friend request
export const sendFriendRequest = (friendRequestData, socketInstance, setProfileStatus, setPendingRequests) => {

    const userId = friendRequestData.userData.userId;
    const profileId = friendRequestData.profileData.userId;

    socketInstance.socket.emit('newFriendRequest', friendRequestData);

    axios.put(`http://localhost:5000/dev-talks/users/${userId}/send-friend-request/${profileId}`, friendRequestData).then(res => {
        setProfileStatus(res.data.status);
        setPendingRequests(pendingRequests => [...pendingRequests, friendRequestData.profileData]); // User has one new pending request
    }).catch(err => console.log(err.response.data));

}

// Accept friend request
export const acceptFriendRequest = (friendRequestData, socketInstance, setProfileStatus, setFriends, setFriendRequests) => {

    const userId = friendRequestData.userData.userId;
    const profileId = friendRequestData.profileData.userId;

    axios.put(`http://localhost:5000/dev-talks/users/${userId}/accept-friend-request/${profileId}`, friendRequestData).then(res => {
        setProfileStatus(res.data.status);
        setFriends(friends => [...friends, friendRequestData.profileData]); // User has one new friend
        setFriendRequests(friendRequests => friendRequests.filter(friendRequest => friendRequest.userId !== profileId));

        socketInstance.socket.emit('acceptFriendRequest', { friendRequestData: friendRequestData, conversationId: res.data.conversationId });
        socketInstance.socket.emit('joinNewConversation', res.data.conversationId);

    }).catch(err => console.log(err.response.data));

}

// Cancel friend request
export const cancelFriendRequest = (friendRequestData, socketInstance, setProfileStatus, setPendingRequests) => {

    const userId = friendRequestData.userData.userId;
    const profileId = friendRequestData.profileData.userId;

    socketInstance.socket.emit('cancelFriendRequest', friendRequestData);

    axios.delete(`http://localhost:5000/dev-talks/users/${userId}/cancel-friend-request/${profileId}`, friendRequestData).then(res => {
        setProfileStatus(res.data.status);
        setPendingRequests(pendingRequests => pendingRequests.filter(pendingRequest => pendingRequest.userId !== profileId));
    }).catch(err => console.log(err.response.data));

}

// Reject friend request
export const rejectFriendRequest = (friendRequestData, socketInstance, setProfileStatus, setFriendRequests) => {

    const userId = friendRequestData.userData.userId;
    const profileId = friendRequestData.profileData.userId;

    socketInstance.socket.emit('rejectFriendRequest', friendRequestData);

    axios.delete(`http://localhost:5000/dev-talks/users/${userId}/reject-friend-request/${profileId}`, friendRequestData).then(res => {
        setProfileStatus(res.data.status);
        setFriendRequests(friendRequests => friendRequests.filter(friendRequest => friendRequest.userId !== profileId));
    }).catch(err => console.log(err.response.data));

}

// Remove friend
export const removeFriend = (friendRequestData, socketInstance, setProfileStatus, setFriends, setMessages, setConversationId) => {

    const userId = friendRequestData.userData.userId;
    const profileId = friendRequestData.profileData.userId;

    socketInstance.socket.emit('unfriend', friendRequestData);

    axios.delete(`http://localhost:5000/dev-talks/users/${userId}/unfriend/${profileId}`, friendRequestData).then(res => {
        setProfileStatus(res.data.status);
        setFriends(friends => friends.filter(friend => friend.userId !== profileId));
        setMessages([]);
        setConversationId('');
    }).catch(err => console.log(err.response.data));

}