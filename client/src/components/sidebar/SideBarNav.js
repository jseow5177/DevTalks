import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { getActiveChannel, removeActiveChannel } from '../../actions/channelActions';
import { getActiveProfile, removeActiveProfile } from '../../actions/profileActions';

function SideBarNav({ auth, socketInstance, type, item, channel, getActiveChannel, profile, getActiveProfile, removeActiveChannel, removeActiveProfile, setTotalUnreads }) {

    // Check if SideBarNav is pointing at a channel or user profile
    const [id, setId] = useState('');

    useEffect(() => {
        if (type === 'channel') {
            setId(item.channelId);
        } else if (type === 'user') {
            setId(item.userId);
        }
    }, [type, item]);

    // Get the number of unread messages
    const [unreadCount, setUnreadCount] = useState(0);
    const [unreadMessages, setUnreadMessages] = useState([]);

    useEffect(() => {
        if (id) {
            if (type === 'channel') {
                axios.get(`http://localhost:5000/dev-talks/channels/${id}/read-by/${auth.user.id}`).then(res => {
                    setUnreadMessages(res.data.unreadMessages);
                    setUnreadCount(res.data.unreadCount);
                    setTotalUnreads(totalUnreads => totalUnreads + res.data.unreadCount)
                }).catch(err => console.log(err.response.data));
            } else if (type === 'user') {
                axios.get(`http://localhost:5000/dev-talks/conversations/${id}/read-by/${auth.user.id}`).then(res => {
                    setUnreadMessages(res.data.unreadMessages);
                    setUnreadCount(res.data.unreadCount);
                    setTotalUnreads(totalUnreads => totalUnreads + res.data.unreadCount)
                }).catch(err => console.log(err.response.data));
            }
        }
    }, [id, type, auth.user.id, setTotalUnreads]);

    // Listen for notifications
    const [notificationData, setNotificationData] = useState(null);

    useEffect(() => {

        if (socketInstance.socket) {
            const notificationListener = socketInstance.socket.on('notification', data => {
                setNotificationData(data);   
            });    
            return () => socketInstance.socket.removeListener('notification', notificationListener);
        }
        
    }, [socketInstance.socket]);

    // Show notifications only when user is not at the channel
    useEffect(() => {

        const selectedChannelId = channel.activeChannel ? `${channel.activeChannel.channelId}` : '';
        const selectedProfileId = profile.activeProfile ? `${profile.activeProfile._id}` : '';

        if (notificationData) {
            if (type === 'channel') {
                if (notificationData.id === id && notificationData.id !== selectedChannelId) {
                    setUnreadMessages(unreadMessages => [...unreadMessages, notificationData.messageId]);
                    setUnreadCount(unreadCount => unreadCount + 1);
                    setTotalUnreads(totalUnreads => totalUnreads + 1);
                }
            } else if (type === 'user') {
                if (notificationData.senderId === id && notificationData.senderId !== selectedProfileId) {
                    setUnreadMessages(unreadMessages => [...unreadMessages, notificationData.messageId]);
                    setUnreadCount(unreadCount => unreadCount + 1);
                    setTotalUnreads(totalUnreads => totalUnreads + 1);
                }
            }
            setNotificationData(null);
        }

    }, [notificationData, channel, profile, id, type, setTotalUnreads]);

    const showActive = (event) => {

        const userData = {
            userId: auth.user.id,
            username: auth.user.username
        }

        const readMessagesData = {
            userData: userData,
            readMessages: unreadMessages
        }

        if (type === 'channel') {
            getActiveChannel(event.target.id);
            removeActiveProfile();

            axios.post(`http://localhost:5000/dev-talks/channels/${id}/read-by/${auth.user.id}`, readMessagesData)
                .then(res => {
                    setUnreadCount(0);
                    setTotalUnreads(totalUnreads => totalUnreads - unreadMessages.length);
                    setUnreadMessages([]);
                })
                .catch(err => console.log(err.response.data));
            
        } else if (type === 'user') {
            getActiveProfile(event.target.id);
            removeActiveChannel();

            axios.post(`http://localhost:5000/dev-talks/conversations/${id}/read-by/${auth.user.id}?profile=true`, readMessagesData)
                .then(res => {
                    setUnreadCount(0);
                    setTotalUnreads(totalUnreads => totalUnreads - unreadMessages.length);
                    setUnreadMessages([]);
                })
                .catch(err => console.log(err.response.data));
        }

    }

    return (
        <div>
            <h6 className='link-wrapper'>
                <button id={id} className='sidebar-link' onClick={showActive}>
                    {type === 'channel' ? `# ${item.channelName}` : `@ ${item.username}`}
                    {unreadCount ? <div className='count-wrapper'>{unreadCount}</div> : null}
                </button>
            </h6>
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
        getActiveChannel: (channelId) => dispatch(getActiveChannel(channelId)),
        getActiveProfile: (userId) => dispatch(getActiveProfile(userId)),
        removeActiveProfile: () => dispatch(removeActiveProfile()),
        removeActiveChannel: () => dispatch(removeActiveChannel())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBarNav);