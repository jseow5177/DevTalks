import React, { useState, useEffect } from 'react';

import Message from './Message';
import { getDate } from '../../utils/date';

function Messages({ messages, messageRef }) {

    const [messagesByDate, setMessagesByDate] = useState([]);
    const [date, setDate] = useState('');

    useEffect(() => {

        setMessagesByDate(messages.messages);

        let date = messages.date;

        const today = new Date();
        const yesterday = new Date(today);

        yesterday.setDate(yesterday.getDate() - 1);

        const dateToday = getDate(today);
        const dateYesterday = getDate(yesterday);

        if (date === dateToday) {
            setDate('Today');
        } else if (date === dateYesterday) {
            setDate('Yesterday');
        } else {
            setDate(messages.date);
        }

    }, [messages]);

    return (
        <div>
            <div className='date-wrapper'>
                <div className='date'>{date}</div>
            </div>
            {
                messagesByDate.map(message => (
                    <Message
                        key={message._id}
                        id={message._id}
                        messageType={message.messageType}
                        username={message.from.username}
                        userId={message.from.userId}
                        message={message.message}
                        time={message.time}
                        messageRef={messageRef}
                    />
                ))
            }
        </div>
    )
}

export default Messages;