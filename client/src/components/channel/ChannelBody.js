import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { v1 as uuidv1 } from 'uuid';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import ChatBody from '../chat/ChatBody';
import ChatInput from '../chat/ChatInput';
import ChannelInfo from './ChannelInfo';
import { getDate } from '../../utils/date';
import { getActiveChannel } from '../../actions/channelActions';

function ChannelBody({ channel, auth, socketInstance, joinedChannels, starredChannels, setJoinedChannels, setStarredChannels }) {

    // Get the channel selected by user
    const [selectedChannel, setSelectedChannel] = useState(null);

    useEffect(() => {

        setSelectedChannel(channel.activeChannel);

    }, [channel.activeChannel]);

    // Get number of participants in the selected channel
    const [noOfMembers, setNoOfMembers] = useState(0);

    useEffect(() => {

        if (selectedChannel) {
            setNoOfMembers(selectedChannel.noOfMembers);
        }

    }, [selectedChannel]);

    // Listen for changes in number of members
    useEffect(() => {

        let newMemberListener;
        let userLeftListener;

        if (socketInstance.socket && selectedChannel) {
            // Listen for users who join channel
            newMemberListener = socketInstance.socket.on('newMember', channelId => {
                if (selectedChannel.channelId === channelId) {
                    setNoOfMembers(oldNoOfMembers => oldNoOfMembers + 1);
                }
            });
            // Listen for users who leave channel
            userLeftListener = socketInstance.socket.on('userLeft', channelId => {
                if (selectedChannel.channelId === channelId) {
                    setNoOfMembers(oldNoOfMembers => oldNoOfMembers - 1);
                }
            });
        }

        return () => {
            socketInstance.socket.removeListener('newMember', newMemberListener);
            socketInstance.socket.removeListener('userLeft', userLeftListener);
        }

    }, [socketInstance.socket, selectedChannel]);

    // Check if user is a member
    const [userIsMember, setUserIsMember] = useState(false);

    useEffect(() => {

        if (selectedChannel) {
            const foundChannel = joinedChannels.find(joinedChannel => joinedChannel.channelId === selectedChannel.channelId);
            if (foundChannel) {
                setUserIsMember(true);
            } else {
                setUserIsMember(false);
            }
        }

    }, [selectedChannel, joinedChannels]);

    // Check if channel is starred by user
    const [starred, setStarred] = useState(false);

    useEffect(() => {

        if (selectedChannel) {
            const foundChannel = starredChannels.find(starredChannel => starredChannel.channelId === selectedChannel.channelId);
            if (foundChannel) {
                setStarred(true);
            } else {
                setStarred(false);
            }
        }

    }, [selectedChannel, starredChannels]);

    // Get channelId, channel name, channel description, channelOwner and messages
    const [channelId, setChannelId] = useState('');
    const [channelName, setChannelName] = useState('');
    const [channelDescription, setChannelDescription] = useState('');
    const [owner, setOwner] = useState({});
    const [messages, setMessages] = useState([]);

    useEffect(() => {

        if (selectedChannel) {
            setChannelId(selectedChannel.channelId);
            setChannelName(selectedChannel.channelName);
            setChannelDescription(selectedChannel.channelDescription);
            setOwner(selectedChannel.owner);
            setMessages(selectedChannel.messagesByDate);
        }

    }, [selectedChannel]);

    const [isSuccess, setIsSuccess] = useState(false); // Check if user successfully joined channel
    const [isFailure, setIsFailure] = useState(false); // Check if user has failed to join the channel

    // Join channel
    const joinChannel = () => {

        const current = new Date().getTime(); // Get the time where the message is sent
        const date = getDate(new Date()); // Get the date where the message is sent

        // Admin message to be saved into db and notify other users that a new user has joined
        const adminMessage = {
            _id: uuidv1(),
            messageType: 'admin',
            from: {
                userId: auth.user.id,
                username: auth.user.username
            },
            message: 'joined',
            time: current,
            readBy: {
                userId: auth.user.id,
                username: auth.user.username
            }
        }

        const messageData = {
            id: channelId,
            date: date,
            message: adminMessage
        }

        // Save admin message into db
        axios.post(`http://localhost:5000/dev-talks/channels/${channelId}/messages/new-message`, adminMessage)
            .then(res => socketInstance.socket.emit('notification', { id: channelId, messageId: adminMessage._id }))
            .catch(err => console.log(err.response.data));

        const data = {
            userData: {
                userId: auth.user.id,
                username: auth.user.username,
            },
            channelData: {
                channelId: channelId,
                channelName: channelName,
                starred: false
            }
        }

        // Add a new channel to the user's existing list of channels
        // Add user to the channel's list of members
        axios.put(`http://localhost:5000/dev-talks/channels/${channelId}/join`, data).then(res => {
            setIsSuccess(true);
            setUserIsMember(true);
            setJoinedChannels(joinedChannels => [...joinedChannels, res.data]);
            socketInstance.socket.emit('newMember', messageData);
        }).catch(err => {
            console.log(err.response.data);
            setIsFailure(true);
        });

        // Close alert after 3 seconds 
        setTimeout(() => {
            setIsSuccess(false);
            setIsFailure(false);
        }, 3000);

        //setAlertTimeout(timeout);

    }

    // Close alert when close button is clicked
    const handleCloseAlert = () => {
        setIsSuccess(false);
        setIsFailure(false);
    }

    // typingUser to be used in ChatBody to show any user who is typing
    // setTypingUser checks if any user is typing in ChatInput
    const [typingUser, setTypingUser] = useState({});

    return (
        <div>
            <div className="alert-message-wrapper">
                {isSuccess ? <Alert variant="success" onClose={handleCloseAlert} dismissible>Joined!</Alert> : null}
                {isFailure ? <Alert variant="danger" onClose={handleCloseAlert} dismissible>Oops. Please try again!</Alert> : null}
            </div>
            <Row className="body-wrapper">
                <Col xs={8}>
                    <ChatBody type='channel' channelId={channelId} messages={messages} setMessages={setMessages} typingUser={typingUser} />
                    {
                        userIsMember
                            ? <ChatInput type='channel' channelId={channelId} setTypingUser={setTypingUser} />
                            : <div className='block-btn-wrapper' onClick={joinChannel}>
                                <Button className='join-channel-btn' block>Join channel</Button>
                            </div>
                    }
                </Col>
                <Col xs={4}>
                    <ChannelInfo
                        channelId={channelId}
                        channelName={channelName}
                        channelDescription={channelDescription}
                        owner={owner}
                        noOfMembers={noOfMembers}
                        userIsMember={userIsMember}
                        setUserIsMember={setUserIsMember}
                        starred={starred}
                        setStarred={setStarred}
                        setJoinedChannels={setJoinedChannels}
                        setStarredChannels={setStarredChannels}
                    />
                </Col>
            </Row>
        </div>
    )
}

const mapStateToProps = state => ({
    channel: state.activeChannel,
    auth: state.auth,
    socketInstance: state.socket
});

const mapDispatchToProps = dispatch => {
    return {
        getActiveChannel: (channelId) => dispatch(getActiveChannel(channelId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelBody);