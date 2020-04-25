import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ReactEmoji from 'react-emoji';

function Message({ username, message, time, auth }) {

    const [messageTime, setMessageTime] = useState(null);

    // Process message time stamp to extract the time and render them
    useEffect(() => {

        const dateObject = new Date(time);
        const hour = (dateObject.getHours() < 10 ? '0' : '') + dateObject.getHours();
        const minute = (dateObject.getMinutes() < 10 ? '0' : '') + dateObject.getMinutes();
        setMessageTime(`${hour}:${minute}`);

    }, [time]);

    return (
        <div>
            <div className={'message-container ' + (auth.user.username === username ? 'message-justify-end' : null)}>
                <div className={'message-box ' + (auth.user.username === username ? 'message-box-purple' : 'message-box-grey')}>
                    {auth.user.username === username ? null : <h6>{username}</h6>}
                    <p>{ReactEmoji.emojify(message)}</p>
                    <p className="time">{messageTime}</p>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, null)(Message);