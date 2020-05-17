import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import { v1 as uuidv1 } from 'uuid';

import Form from 'react-bootstrap/Form';

import CreateIcon from '@material-ui/icons/Create';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';

import FormRow from '../main/FormRow';
import { getDate } from '../../utils/date';
import { scrollToFirstUnread } from '../../actions/notificationActions';

function ChatInput({ socketInstance, auth, setTypingUser, type, channelId, conversationId, scrollToFirstUnread }) {
    
    // Handle message typing
    const [message, setMessage] = useState('');
    const [typingTimeout, setTypingTimeout] = useState(0);

    const handleChangeMessage = (event) => {
        setMessage(event.target.value);

        const id = type === 'channel' ? channelId : conversationId;

        const someoneTyping = {
            id: id,
            username: auth.user.username
        }

        socketInstance.socket.emit('isTyping', someoneTyping);

        clearTimeout(typingTimeout);
        setTypingTimeout(() => {
            const stoppedTyping = {
                id: id,
                username: ''
            }
            setTimeout(() => socketInstance.socket.emit('isTyping', stoppedTyping), 3000);
        });
    }

    // See if any user is typing
    useEffect(() => {

        const isTypingListener = data => {
            setTypingUser(data);
        }

        if (socketInstance.socket) {

            socketInstance.socket.on('isTyping', isTypingListener);

            return () => {
                socketInstance.socket.off('isTyping', isTypingListener);
            };

        }

    }, [socketInstance.socket, setTypingUser]);

    // Handle emoji selector
    const [isPickerVisible, setIsPickerVisible] = useState(false);

    // Close emoji picker when escape key is pressed
    const detectEscapeKey = event => {
        if (event.key === "Escape") {
            setIsPickerVisible(false);
        }
    }

    // Add event listener to detect escape key press
    useEffect(() => {
        document.addEventListener('keydown', detectEscapeKey);

        return () => {
            document.removeEventListener('keydown', detectEscapeKey);
        };
    }, []);

    // Show emoji collection
    const showPicker = () => {
        setIsPickerVisible(!isPickerVisible);
    }

    // Add emoji to message
    const addEmoji = (emoji) => {
        setMessage(message + emoji.native);
        setIsPickerVisible(false);
        document.getElementById('message').focus();
    }

    // Emit message to other users in room
    // Save message to db
    const sendMessage = event => {

        event.preventDefault();

        scrollToFirstUnread(null);

        const current = new Date().getTime();
        const date = getDate(new Date());

        // Do not send and save empty string
        if (message) {
            const newMessage = {
                _id: uuidv1(),
                messageType: 'user',
                from: { // Get logged in user id and username
                    userId: auth.user.id,
                    username: auth.user.username
                },
                message: message,
                time: current,
                readBy: []
            }

            const id = type === 'channel' ? channelId : conversationId;

            const messageData = {
                id: id,
                date: date,
                message: newMessage
            }

            // When user sent message, remove any 'is typing...'
            socketInstance.socket.emit('isTyping', {
                id: id,
                username: ''
            });

            if (type === 'channel') {
                // Save message into channel
                axios.post(`http://localhost:5000/dev-talks/channels/${channelId}/messages/new-message`, newMessage)
                    .then(res => {
                        socketInstance.socket.emit('notification', { id: channelId, messageId: newMessage._id });
                        // Emit message in real time
                        socketInstance.socket.emit('sendMessage', messageData);
                        setMessage('');
                    })
                    .catch(err => console.log(err.response.data));
            } else if (type === 'user') {
                // Save message into conversation
                axios.post(`http://localhost:5000/dev-talks/conversations/${conversationId}/messages/new-message`, newMessage)
                    .then(res => {
                        socketInstance.socket.emit('notification', { id: conversationId, senderId: auth.user.id, messageId: newMessage._id });
                        // Emit message in real time
                        socketInstance.socket.emit('sendMessage', messageData);
                        setMessage('');
                    })
                    .catch(err => console.log(err.response.data));
            }

        }

    }

    return (
        <div>
            {
                isPickerVisible
                    ? <div className='picker-wrapper'>
                        <Picker
                            showPreview={false}
                            title='Pick your emoji…'
                            emoji='point_up'
                            onClick={addEmoji}
                        />
                    </div>
                    : null
            }
            <div className='chat-input-wrapper'>
                <Form onSubmit={sendMessage}>
                    <InsertEmoticonIcon className='insert-emoticon-icon' onClick={showPicker} />
                    <FormRow
                        id='message'
                        type='text'
                        placeholder='Type a message'
                        icon={<CreateIcon />}
                        value={message}
                        handleChange={handleChangeMessage}
                    />
                </Form>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    socketInstance: state.socket,
    auth: state.auth
});

const mapDispatchToProps = dispatch => {
    return {
        scrollToFirstUnread: (channelId) => dispatch(scrollToFirstUnread(channelId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatInput);