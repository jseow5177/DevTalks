import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import SyncLoader from 'react-spinners/SyncLoader';

import { sendNotifications } from '../../actions/notificationActions';

import Messages from './Messages';

function ChatBody({ channel, socketInstance, typingUser, sendNotifications }) {

    const [channelId, setChannelId] = useState("");
    const [messages, setMessages] = useState([]);
    const [rawMessage, setRawMessage] = useState("");
    const [isNewMessage, setIsNewMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasNotifications, setHasNotifications] = useState(false);

    const scrollToBottom = () => {
        const div = document.querySelector('#dummy-div');
        // Check if all messages are loaded and scrolled to the bottom
        const intersectionObserver = new IntersectionObserver((entries) => {
            let [entry] = entries;
            if (entry.isIntersecting) {
                setTimeout(() => {
                    setIsLoading(false)
                }, 500);
            }
        });
        // start the bottom dummy div
        intersectionObserver.observe(div);
        setTimeout(() => div.scrollIntoView());
    }

    // Get the Id of active channel
    useEffect(() => {

        if (channel.activeChannel) {
            setChannelId(channel.activeChannel.channelId);
        }

    }, [channel]);

    // Retrive all past messages
    useEffect(() => {

        if (channelId) {
            setIsLoading(true);
            axios.get(`http://localhost:5000/dev-talks/channels/${channelId}/`).then(res => {
                setMessages(res.data.messagesByDate);
                scrollToBottom();
            }).catch(err => {
                console.log(err.response.data);
            });
        }

    }, [channelId]);

    // Attach socket instance to receive new messages
    useEffect(() => {

        socketInstance.socket.on('message', messageData => {
            console.log('hello');
            setRawMessage(messageData);
            setIsNewMessage(true);
        });

    }, [socketInstance.socket]);

    // Add new messages received by socket
    if (rawMessage && isNewMessage) {

        setIsNewMessage(false);

        if (rawMessage.channelId === channelId) {

            setMessages(messages => {

                // Get the messages sent at the latest date
                const latestMessagesGroupedByDate = messages[messages.length - 1];

                // If there are no messages (new channel) or the newest message is sent on a new latest date
                if (!latestMessagesGroupedByDate || latestMessagesGroupedByDate.date !== rawMessage.date) {
                    messages.push({
                        date: rawMessage.date,
                        messages: [rawMessage.message]
                    });

                    // If the newest message is sent on the same latest date
                } else if (latestMessagesGroupedByDate.date === rawMessage.date) {

                    const latestMessage = latestMessagesGroupedByDate.messages[latestMessagesGroupedByDate.messages.length - 1];

                    // This condition prevents setMessages from being executed twice on the first render
                    if (latestMessage !== rawMessage.message) {
                        latestMessagesGroupedByDate.messages.push(rawMessage.message);
                        messages.pop();
                        messages.push(latestMessagesGroupedByDate);
                    }

                }

                return messages;

            });

            scrollToBottom();

        } else {

            setHasNotifications(true);
            
        }

    }


    useEffect(() => {
        if (hasNotifications) {
            sendNotifications(rawMessage.channelId);
        }
        setHasNotifications(false);
    }, [setHasNotifications, hasNotifications, sendNotifications, rawMessage])

    return (
        <div className='chat-body-wrapper'>
            <div className={'loading-screen ' + (isLoading ? null : 'hidden')}><SyncLoader color={"#4B0082"} loading={isLoading} /></div>
            <div className={'messages scroll ' + (isLoading ? 'hidden' : null)} >
                <div>{messages.map((messages, index) => <Messages key={index} messages={messages} />)}</div>
                <div id="dummy-div" style={{ border: '1px solid white' }}></div>
            </div>
            {typingUser.channelId === channelId && typingUser.username !== '' ? <div>{typingUser.username} is typing... </div> : null}
        </div>
    )
}

const mapStateToProps = state => ({
    channel: state.activeChannel,
    socketInstance: state.socket
});

const mapDispatchToProps = dispatch => {
    return {
        sendNotifications: (channelId) => dispatch(sendNotifications(channelId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatBody);