import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import axios from 'axios';

import { startSocket } from '../../actions/socketActions';

import SideBar from '../sidebar/SideBar';
import Header from './Header';
import ChannelBody from '../channel/ChannelBody';
import ProfileBody from '../profile/ProfileBody';
import EmptyState from './EmptyState';

function HomePage({ startSocket, auth, channel, profile, socketInstance }) {

    // Establish socket instance
    const ENDPOINT = 'localhost:5000';

    useEffect(() => {
        const socket = io(ENDPOINT);
        socket.on('connect', () => startSocket(socket));
        return () => socket.emit('disconnect');
    }, [startSocket]);

    /********** Channel Logic *********/

    // Get all available channels
    const [allChannels, setAllChannels] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/dev-talks/channels')
            .then(res => setAllChannels(res.data))
            .catch(err => console.log(err.response.data))
    }, []);

    // Get channels joined by user
    const [joinedChannels, setJoinedChannels] = useState([]);
    const [starredChannels, setStarredChannels] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/dev-talks/users/${auth.user.id}/channels/`).then(res => {
            const userChannels = res.data;
            const starredChannels = userChannels.filter(channel => channel.starred);
            setJoinedChannels(userChannels);
            setStarredChannels(starredChannels);
        }).catch(err => console.log(err));
    }, [auth.user.id]);

    /********** Profile Logic *********/

    // Get all friend requests
    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {

        axios.get(`http://localhost:5000/dev-talks/users/${auth.user.id}/friend-requests`).then(res => {
            setFriendRequests(res.data);
        }).catch(err => console.log(err));

    }, [auth.user.id]);

    // Get all friends
    const [friends, setFriends] = useState([]);

    useEffect(() => {

        axios.get(`http://localhost:5000/dev-talks/users/${auth.user.id}/friends/`).then(res => {
            setFriends(res.data);
        }).catch(err => console.log(err));

    }, [auth.user.id]);

    // Get all pending friend requests
    const [pendingRequests, setPendingRequests] = useState([]);

    useEffect(() => {

        axios.get(`http://localhost:5000/dev-talks/users/${auth.user.id}/pending-requests/`).then(res => {
            setPendingRequests(res.data);
        }).catch(err => console.log(err));

    }, [auth.user.id]);

    // Get all conversations
    useEffect(() => {

        axios.get(`http://localhost:5000/dev-talks/users/${auth.user.id}/conversations/`).then(res => {
            if (socketInstance.socket) {
                socketInstance.socket.emit('joinConversation', res.data);
            }
        });

    }, [auth.user.id, socketInstance.socket]);

    // Provide live updates on friend requests
    useEffect(() => {

        const acceptFriendListener = friendRequestData => {
            if (friendRequestData.profileData.userId === auth.user.id) {
                setFriends(friends => [...friends, friendRequestData.userData]);
                setPendingRequests(pendingRequests => pendingRequests.filter(pendingRequest => pendingRequest.userId !== friendRequestData.userData.userId));
            }
        }

        const newFriendListener = friendRequestData => {
            if (friendRequestData.profileData.userId === auth.user.id) {
                setFriendRequests(friendRequests => [...friendRequests, friendRequestData.userData]);
            }
        }

        const cancelFriendListener = friendRequestData => {
            if (friendRequestData.profileData.userId === auth.user.id) {
                setFriendRequests(friendRequests => friendRequests.filter(friendRequest => friendRequest.userId !== friendRequestData.userData.userId));
            }
        }

        const rejectFriendListener = friendRequestData => {
            if (friendRequestData.profileData.userId === auth.user.id) {
                setPendingRequests(pendingRequests => pendingRequests.filter(pendingRequest => pendingRequest.userId !== friendRequestData.userData.userId));
            }
        }

        const unfriendListener = friendRequestData => {
            if (friendRequestData.profileData.userId === auth.user.id) {
                setFriends(friends => friends.filter(friend => friend.userId !== friendRequestData.userData.userId));
            }
        }

        // Listen to any accept of friend request
        if (socketInstance.socket) {

            socketInstance.socket.on('acceptFriendRequest', acceptFriendListener);

            socketInstance.socket.on('newFriendRequest', newFriendListener);

            socketInstance.socket.on('cancelFriendRequest', cancelFriendListener);

            socketInstance.socket.on('rejectFriendRequest', rejectFriendListener);

            socketInstance.socket.on('unfriend', unfriendListener);

            return () => {
                socketInstance.socket.off('acceptFriendRequest', acceptFriendListener);
                socketInstance.socket.off('newFriendRequest', newFriendListener);
                socketInstance.socket.off('cancelFriendRequest', cancelFriendListener);
                socketInstance.socket.off('rejectFriendRequest', rejectFriendListener);
                socketInstance.socket.off('unfriend', unfriendListener);
            }
        }

    }, [socketInstance.socket, auth.user.id]);

    return (
        <div className="main">
            <Header allChannels={allChannels} />
            <SideBar
                // Joined Channels Section
                joinedChannels={joinedChannels}
                setJoinedChannels={setJoinedChannels}
                // Starred Channels Section
                starredChannels={starredChannels}
                // Friends Section
                friends={friends}
                // Friend Requests Section
                friendRequests={friendRequests}
            />
            {
                channel.activeChannel
                    ? <ChannelBody
                        joinedChannels={joinedChannels}
                        starredChannels={starredChannels}
                        setJoinedChannels={setJoinedChannels}
                        setStarredChannels={setStarredChannels}
                    />
                    : null
            }
            {
                profile.activeProfile
                    ? <ProfileBody
                        friends={friends}
                        friendRequests={friendRequests}
                        pendingRequests={pendingRequests}
                        setFriends={setFriends}
                        setFriendRequests={setFriendRequests}
                        setPendingRequests={setPendingRequests}
                    />
                    : null
            }
            {
                !channel.activeChannel && !profile.activeProfile
                    ? <EmptyState />
                    : null
            }
        </div>
    )
}

const mapStateToProps = state => ({
    auth: state.auth,
    socketInstance: state.socket,
    channel: state.activeChannel,
    profile: state.activeProfile
});

const mapDispatchToProps = (dispatch) => {
    return {
        startSocket: (socketId) => dispatch(startSocket(socketId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);