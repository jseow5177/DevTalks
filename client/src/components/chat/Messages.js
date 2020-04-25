import React, { useState, useEffect } from 'react';

import Message from './Message';

function Messages({ messages }) {

    const [messagesByDate, setMessagesByDate] = useState([]);
    const [date, setDate] = useState("");

    useEffect(() => {
        setMessagesByDate(messages.messages);
        setDate(messages.date);
    }, [messages]);

    return (
        <div>
            <div className="date-wrapper">
                <div className="date">{date}</div>
            </div>
            <div>
                {messagesByDate.map((message, index) =>
                    <Message
                        key={index}
                        username={message.from.username}
                        message={message.message}
                        time={message.time}
                    />)
                }
            </div>
        </div>
    )
}

export default Messages;