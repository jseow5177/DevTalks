import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import SyncLoader from 'react-spinners/SyncLoader';

import Messages from './Messages';

function ChatBody({ auth, socketInstance, type, channelId, conversationId, messages, setMessages, typingUser, channel }) {

    const [isLoading, setIsLoading] = useState(true); // Show chat spinner during initial scroll of chat body
    const [newMessage, setNewMessage] = useState(null);
    const [id, setId] = useState(null);

    useEffect(() => {

        if (type === 'channel') {
            setId(channelId);
        } else if (type === 'user') {
            setId(conversationId);
        }

    }, [type, channelId, conversationId]);

    // Listen for new messages
    useEffect(() => {

        if (socketInstance.socket) {
            const messageListener = socketInstance.socket.on('message', messageData => {
                setNewMessage(messageData);
            });

            return () => socketInstance.socket.removeListener('message', messageListener);
        }

    }, [socketInstance]);

    // Update readBy
    useEffect(() => {

        if (newMessage && newMessage.id === id) {
            const userData = {
                userId: auth.user.id,
                username: auth.user.username
            }
            const readMessagesData = {
                userData: userData,
                readMessages: [newMessage.message._id]
            }

            if (newMessage.id === channelId) {
                axios.post(`http://localhost:5000/dev-talks/channels/${newMessage.id}/read-by/${auth.user.id}`, readMessagesData)
                    .catch(err => console.log(err));
            } else if (newMessage.id === conversationId) {
                axios.post(`http://localhost:5000/dev-talks/conversations/${newMessage.id}/read-by/${auth.user.id}?profile=false`, readMessagesData)
                    .catch(err => console.log(err));
            }
        }

    }, [auth.user, channelId, conversationId, newMessage, id]);

    // Update messages when there is new message
    useEffect(() => {

        if (newMessage && newMessage.id === id) {
            setMessages(messages => {

                // Get the messages sent at the latest date
                const latestMessages = messages[messages.length - 1];

                // If there are no messages (new channel) or the newest message is sent on a new latest date
                if (!latestMessages || latestMessages.date !== newMessage.date) {
                    messages.push({ date: newMessage.date, messages: [newMessage.message] });

                    // If the newest message is sent on the same latest date
                } else if (latestMessages.date === newMessage.date) {
                    // const latestMessage = latestMessages.messages[latestMessages.messages.length - 1];
                    latestMessages.messages.push(newMessage.message);
                    messages.pop();
                    messages.push(latestMessages);
                }
                return messages;

            });
            setNewMessage(null);
        }

    }, [newMessage, setMessages, id]);


    // Auto scroll to bottom
    useEffect(() => {

        const div = document.querySelector('#dummy-div');
        const timeout = setTimeout(() => {
            div.scrollIntoView();
            setIsLoading(false);
        }, 100);
        return () => clearTimeout(timeout);
        
    }, [messages, newMessage]);

    return (
        <div className='chat-body-wrapper'>
            <div className={'loading-screen ' + (isLoading ? null : 'hidden')}><SyncLoader color={"#4B0082"} loading={isLoading} /></div>
            <div className={'messages scroll ' + (isLoading ? 'hidden' : null)} >
                {messages.map((messages, index) => <Messages key={index} messages={messages} />)}
                <div id='dummy-div' />
            </div>
            {typingUser.id === id && typingUser.username !== '' ? <div>{typingUser.username} is typing... </div> : null}
        </div>
    )
}

const mapStateToProps = state => ({
    socketInstance: state.socket,
    auth: state.auth,
    channel: state.activeChannel
});


export default connect(mapStateToProps, null)(ChatBody);