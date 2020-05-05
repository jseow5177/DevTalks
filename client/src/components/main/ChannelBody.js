import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import ChatBody from '../chat/ChatBody';
import ChatInput from '../chat/ChatInput';
import ChannelInfo from './ChannelInfo';
import EmptyState from './EmptyState';
import { getDate } from '../../utils/date';
import { getActiveChannel } from '../../actions/channelActions';

function ChannelBody({ channel, auth, socketInstance, joinedChannels, starredChannels }) {

    // Get the channel selected by user
    const [selectedChannel, setSelectedChannel] = useState(null);

    useEffect(() => {
        setSelectedChannel(channel.activeChannel);
    }, [channel]);

    // Get number of participants in the selected channel
    const [noOfMembers, setNoOfMembers] = useState(0);

    useEffect(() => {
        if (selectedChannel) {
            setNoOfMembers(selectedChannel.noOfMembers);
        }
    }, [selectedChannel]);

    // Listen for changes in number of members
    useEffect(() => {
        if (socketInstance.socket && selectedChannel) {
            // Listen for users who join channel
            socketInstance.socket.on('newMember', channelId => {
                if (selectedChannel.channelId === channelId) {
                    setNoOfMembers(oldNoOfMembers => oldNoOfMembers + 1);
                }
            });
            // Listen for users who leave channel
            socketInstance.socket.on('userLeft', channelId => {
                if (selectedChannel.channelId === channelId) {
                    setNoOfMembers(oldNoOfMembers => oldNoOfMembers - 1);
                }
            });
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

    // Get channelId, channel name, channel description and channelOwner
    const [channelId, setChannelId] = useState('');
    const [channelName, setChannelName] = useState('');
    const [channelDescription, setChannelDescription] = useState('');
    const [owner, setOwner] = useState({});

    useEffect(() => {
        if (selectedChannel) {
            setChannelId(selectedChannel.channelId);
            setChannelName(selectedChannel.channelName);
            setChannelDescription(selectedChannel.channelDescription);
            setOwner(selectedChannel.owner);
        }
    }, [selectedChannel]);

    // typingUser to be used in ChatBody to show any user who is typing
    // setTypingUser checks if any user is typing in ChatInput
    const [typingUser, setTypingUser] = useState({});

    const [isSuccess, setIsSuccess] = useState(false); // Check if user successfully joined channel
    const [isFailure, setIsFailure] = useState(false); // Check if user has failed to join the channel

    // Join channel
    const joinChannel = () => {

        const current = new Date().getTime(); // Get the time where the message is sent
        const date = getDate(new Date()); // Get the date where the message is sent

        const userInfo = {
            userData: {
                userId: auth.user.id,
                username: auth.user.username,
            }
        }

        // Admin message to be saved into db and notify other users that a new user has joined
        const adminMessage = {
            messageType: 'admin',
            from: {
                userId: auth.user.id,
                username: auth.user.username
            },
            message: 'joined',
            time: current
        }

        const messageData = {
            channelId: selectedChannel.channelId,
            date: date,
            message: adminMessage
        }

        // Save admin message into db
        axios.post(`http://localhost:5000/dev-talks/channels/${selectedChannel.channelId}/messages/new-message`, adminMessage)
            .catch(err => console.log(err.response.data));

        // Add a new channel to the user's existing list of channels
        // Add user to the channel's list of members
        axios.put(`http://localhost:5000/dev-talks/channels/${selectedChannel.channelId}/join`, userInfo).then(res => {
            setIsSuccess(true);
            setUserIsMember(true);
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

    }

    // Close alert when close button is clicked
    const handleCloseAlert = () => {
        setIsSuccess(false);
        setIsFailure(false);
    }

    return (
        <div>
            <div className="alert-message-wrapper">
                {isSuccess ? <Alert variant="success" onClose={handleCloseAlert} dismissible>Joined!</Alert> : null}
                {isFailure ? <Alert variant="danger" onClose={handleCloseAlert} dismissible>Oops. Please try again!</Alert> : null}
            </div>
            {
                selectedChannel
                    ? <Row className="body-wrapper">
                        <Col xs={8}>
                            <ChatBody typingUser={typingUser} />
                            {
                                userIsMember
                                    ? <ChatInput setTypingUser={setTypingUser} />
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
                            />
                        </Col>
                    </Row>
                    : <div><EmptyState /></div>
            }
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