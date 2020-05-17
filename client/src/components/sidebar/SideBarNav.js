import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { getActiveChannel, removeActiveChannel } from '../../actions/channelActions';
import { getActiveProfile, removeActiveProfile } from '../../actions/profileActions';
import { scrollToFirstUnread } from '../../actions/notificationActions';

function SideBarNav({ auth, id, socketInstance, star, type, item, channel, getActiveChannel, profile, getActiveProfile, removeActiveChannel, removeActiveProfile, setTotalUnreads, scrollToFirstUnread }) {

    // Get the number of unread messages
    const [unreadCount, setUnreadCount] = useState(0);
    const [unreadMessages, setUnreadMessages] = useState([]);

    useEffect(() => {
        let isSubscribed = true;

        if (id && isSubscribed) {
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

        return () => isSubscribed = false;

    }, [id, type, auth.user.id, setTotalUnreads]);

    // Listen for notifications
    const [notificationData, setNotificationData] = useState(null);

    useEffect(() => {

        if (socketInstance.socket) {

            const notificationListener = data => {
                setNotificationData(data);
            }

            socketInstance.socket.on('notification', notificationListener);

            return () => {
                socketInstance.socket.off('notification', notificationListener);
            };
        }

    }, [socketInstance.socket]);

    // Show notifications only when user is not at the channel
    useEffect(() => {

        const selectedChannelId = channel.activeChannel ? `${channel.activeChannel.channelId}` : '';
        const selectedProfileId = profile.activeProfile ? `${profile.activeProfile._id}` : '';
        let isSubscribed = true;

        if (notificationData && isSubscribed) {
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

        return () => isSubscribed = false;

    }, [notificationData, channel, profile, id, type, setTotalUnreads]);

    // Sync joinedChannels with starredChannels
    useEffect(() => {

        const syncStarAndJoinListener = data => {
            if (data.channelId === id && data.userId === auth.user.id) {
                setUnreadCount(0);
                setTotalUnreads(totalUnreads => totalUnreads - data.messages.length);
                setUnreadMessages([]);
            }
        }

        socketInstance.socket.on('linkToStarChannel', syncStarAndJoinListener);

        return () => socketInstance.socket.off('linkToStarChannel', syncStarAndJoinListener);

    }, [socketInstance.socket, star, setTotalUnreads, id, auth.user]);

    const showActive = (event) => {

        const userData = {
            userId: auth.user.id,
            username: auth.user.username
        }

        const readMessagesData = {
            userData: userData,
            readMessages: unreadMessages
        }

        // Mark the id of the first unread message
        scrollToFirstUnread(unreadMessages);

        if (type === 'channel') {

            getActiveChannel(event.target.id);
            removeActiveProfile();

            socketInstance.socket.emit('linkToStarChannel', { channelId: id, messages: unreadMessages });

            axios.post(`http://localhost:5000/dev-talks/channels/${id}/read-by/${auth.user.id}`, readMessagesData)
                .then(res => {
                    // To sync the notification changes between join and star section
                    socketInstance.socket.emit('linkToStarChannel', { userId: auth.user.id, channelId: id, messages: unreadMessages });
                    // setUnreadCount(0);
                    // setTotalUnreads(totalUnreads => totalUnreads - unreadMessages.length);
                    // setUnreadMessages([]);
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
                .catch(err => console.log(err.response));
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
        removeActiveChannel: () => dispatch(removeActiveChannel()),
        scrollToFirstUnread: (messageId) => dispatch(scrollToFirstUnread(messageId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBarNav);