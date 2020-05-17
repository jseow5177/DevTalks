import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import SyncLoader from 'react-spinners/SyncLoader';

import Messages from './Messages';
import { scrollToFirstUnread } from '../../actions/notificationActions';

function ChatBody({ auth, socketInstance, type, channelId, conversationId, messages, setMessages, typingUser, notification, scrollToFirstUnread }) {

    const messageRef = useRef(null);

    const [isLoading, setIsLoading] = useState(true); // Show chat spinner during initial scroll of chat body
    const [newMessage, setNewMessage] = useState(null);
    const [id, setId] = useState(null);
    const [showArrowDown, setShowArrowDown] = useState(false);

    useEffect(() => {

        if (type === 'channel') {
            setId(channelId);
        } else if (type === 'user') {
            setId(conversationId);
        }

    }, [type, channelId, conversationId]);

    // Listen for new messages
    const [shouldScroll, setShouldScroll] = useState(false);
    const [liveUnread, setLiveUnread] = useState(0);

    useEffect(() => {

        const messageListener = messageData => {
            if (messageData.id === id) {
                
                setNewMessage(messageData);

                // If the message is sent by the user, automatically scroll to bottom
                if (messageData.message.from.userId === auth.user.id) {
                    setShouldScroll(true);
                // If the message is sent by other user, do not scroll to bottom.
                // Instead, show the little red symbol
                } else {
                    setShouldScroll(false);
                    setLiveUnread(liveUnread => liveUnread + 1);
                }

            }

        }

        if (socketInstance.socket) {

            socketInstance.socket.on('message', messageListener);

            return () => socketInstance.socket.off('message', messageListener);
        }

    }, [socketInstance, id, auth.user]);

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

        if (newMessage) {

            scrollToFirstUnread(null);

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

    }, [newMessage, setMessages, id, scrollToFirstUnread]);


    // Auto scroll to bottom
    const scrollToBottom = () => {
        const div = document.querySelector('#dummy-div');
        div.scrollIntoView();
        setLiveUnread(0);
    }

    // Scroll to the first unread message
    const scrollToUnread = (messageRef) => {
        messageRef.current.scrollIntoView();
    }

    // Scroll to unread message or scroll to bottom
    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsLoading(false);
            if (messageRef.current) {
                scrollToUnread(messageRef); // Scroll to unread message
                messageRef.current = null
            } else if ((showArrowDown && shouldScroll) || isLoading || (!showArrowDown)) {
                // Only scroll to bottom under these two conditions
                // 1. Initial load
                // 2. User sends a message when not scrolled to bottom
                scrollToBottom();
            }
        }, 100);
        return () => clearTimeout(timeout);
    }, [messages, newMessage, notification.messageId, showArrowDown, shouldScroll, isLoading]);

    // Check user's scroll position

    const scrollListener = () => {
        const messagesDiv = document.querySelector('#messages-div');
        const currentScrollPos = messagesDiv.scrollTop;
        const scrollHeight = messagesDiv.scrollHeight;
        const clientHeight = messagesDiv.clientHeight;

        if (scrollHeight - clientHeight === Math.round(currentScrollPos)) {
            setShowArrowDown(false);
        } else {
            setShowArrowDown(true);
        }
    }

    // Listen to scroll in messages div
    useEffect(() => {
        const messagesDiv = document.querySelector('#messages-div');
        messagesDiv.addEventListener('scroll', scrollListener);
        return () => messagesDiv.removeEventListener('scroll', scrollListener);
    }, []);

    return (
        <div className='chat-body-wrapper'>
            <div className={'loading-screen ' + (isLoading ? null : 'hidden')}><SyncLoader color={"#4B0082"} loading={isLoading} /></div>
            <div id='messages-div' className={'messages scroll ' + (isLoading ? 'hidden' : null)} >
                {messages.map((messages, index) => <Messages key={index} messages={messages} messageRef={messageRef} />)}
                <div id='dummy-div' />
            </div>
            {typingUser.id === id && typingUser.username !== '' ? <div>{typingUser.username} is typing... </div> : null}
            {showArrowDown ? <i className='fas fa-arrow-alt-circle-down arrow-circle-down' onClick={scrollToBottom}></i> : null}
            {liveUnread !== 0 ? <div className='live-unread'>{liveUnread}</div> : null}
        </div>
    )
}

const mapStateToProps = state => ({
    socketInstance: state.socket,
    auth: state.auth,
    notification: state.notification
});

const mapDispatchToProps = dispatch => {
    return {
        scrollToFirstUnread: (messageId) => dispatch(scrollToFirstUnread(messageId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatBody);