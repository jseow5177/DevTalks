import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { sendNotifications } from '../../actions/notificationActions';

import Image from 'react-bootstrap/Image';

function EmptyState({ socketInstance, sendNotifications, auth }) {

    // Allows user to receive notifications when they are still in EmptyState
    useEffect(() => {
        if (socketInstance.socket) {
            socketInstance.socket.on('message', messageData => {
                const senderId = messageData.message.from.userId;
                if (senderId !== auth.user.id) {
                    sendNotifications(messageData.channelId);
                }
            });
            return () => {
                socketInstance.socket.off('message');
            }
        }

    }, [socketInstance.socket, sendNotifications, auth]);

    return (
        <div className="empty-state-wrapper">
            <Image src={`${process.env.PUBLIC_URL}/empty-state.png`} roundedCircle />
            <h2>Keep the conversation going</h2>
            <h3>Join or create a channel.</h3>
        </div>
    )
}

const mapStateToProps = state => ({
    auth: state.auth,
    socketInstance: state.socket
});

const mapDispatchToProps = dispatch => {
    return {
        sendNotifications: (channelId) => dispatch(sendNotifications(channelId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmptyState);