import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ReactEmoji from 'react-emoji';

import { getTime } from '../../utils/date';
import { getActiveProfile } from '../../actions/profileActions';
import { removeActiveChannel } from '../../actions/channelActions';

function Message({ username, userId, message, time, auth, messageType, getActiveProfile, removeActiveChannel, messageRef, id, notification }) {

    const [unreadMessages, setUnreadMessages] = useState([]);

    useEffect(() => {
        setUnreadMessages(notification.unreadMessages);
    }, [notification.unreadMessages]);

    const [messageTime, setMessageTime] = useState(null);

    // Process message time stamp to extract the time and render them
    useEffect(() => {
        setMessageTime(getTime(time));
    }, [time]);

    const getUserInfo = (event) => {
        const userId = event.target.id;
        // Show user profile
        getActiveProfile(userId);
        removeActiveChannel();
    }

    return (
        <div ref={unreadMessages && id === unreadMessages[0] ? messageRef : null}>
            {unreadMessages && id === unreadMessages[0] ?
                <div className='unread-message-container'>
                    <div className='unread-message'>{unreadMessages.length} UNREAD {unreadMessages.length > 1 ? 'MESSAGES' : 'MESSAGE'}</div>
                </div>
                : null
            }
            {
                <div>
                    {
                        messageType !== 'admin'
                            ? <div className={'message-container ' + (auth.user.username === username ? 'message-justify-end' : null)}>
                                <div className={'message-box ' + (auth.user.username === username ? 'message-box-purple' : 'message-box-grey')}>
                                    {auth.user.username === username ? null : <h6 id={userId} className='username-link' onClick={getUserInfo}>{username}</h6>}
                                    <p>{ReactEmoji.emojify(message)}</p>
                                    <p className="time">{messageTime}</p>
                                </div>
                            </div>
                            : <div className='admin-message-box'>
                                {
                                    username === auth.user.username
                                        ? <p>You have {message}</p>
                                        : <p><span id={userId} className='username-link' onClick={getUserInfo}>{username}</span> has {message}</p>
                                }
                            </div>
                    }
                </div>
            }
        </div>
    )
}

const mapStateToProps = state => ({
    auth: state.auth,
    notification: state.notification
});

const mapDispatchToProps = dispatch => {
    return {
        getActiveProfile: (userId) => dispatch(getActiveProfile(userId)),
        removeActiveChannel: () => dispatch(removeActiveChannel())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Message);