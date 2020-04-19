import React from 'react';

function Message({username, message}) {
    return (
        <div className='message-wrapper'>
            <h6>{username}</h6>
            <p>{message}</p>
        </div>
    )
}

export default Message;