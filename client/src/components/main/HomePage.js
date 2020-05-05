import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import axios from 'axios';

import { startSocket } from '../../actions/socketActions';

import SideBar from '../sidebar/SideBar';
import Header from './Header';
import ChannelBody from './ChannelBody';

function HomePage({ startSocket, auth, socketInstance, channel, profile }) {

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
    }, [auth.user.id, channel]);

    /********** Profile Logic *********/

    // Get all friend requests
    const [friendRequests, setFriendRequests] = useState([]);
    const [friendRequestTracker, setFriendRequestTracker] = useState('');

    // Listen for friend requests
    useEffect(() => {
        if (socketInstance.socket) {
            socketInstance.socket.on('friendRequest', userData => {
                setFriendRequestTracker(Math.random()); // Dummy variable to trigger useEffect
            });
        }
    }, [socketInstance]);
    
    useEffect(() => {
        axios.get(`http://localhost:5000/dev-talks/users/${auth.user.id}/friend-requests`).then(res => {
            setFriendRequests(res.data);
        }).catch(err => console.log(err));
    }, [auth.user.id, friendRequestTracker]);

    // Get all friends
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/dev-talks/users/${auth.user.id}/friends/`).then(res => {
            setFriends(res.data);
        }).catch(err => console.log(err));
    }, [auth.user.id]);

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
                  />
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