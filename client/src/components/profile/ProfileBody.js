import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import ChatBody from '../chat/ChatBody';
import ChatInput from '../chat/ChatInput';
import ProfileInfo from './ProfileInfo';

import { sendFriendRequest, acceptFriendRequest, cancelFriendRequest, rejectFriendRequest, removeFriend } from '../../utils/friendRequest';

function ProfileBody({ auth, profile, socketInstance, friends, setFriends, friendRequests, setFriendRequests, pendingRequests, setPendingRequests }) {

    // Get the profile selected by user
    const [selectedProfile, setSelectedProfile] = useState(null);

    useEffect(() => {

        if (profile.activeProfile) {
            setSelectedProfile(profile.activeProfile);
        }   
        
    }, [profile.activeProfile]);

    // Set friend request data
    const [friendRequestData, setFriendRequestData] = useState({});

    useEffect(() => {
        if (selectedProfile) {
            setFriendRequestData({
                profileData: {
                    userId: selectedProfile._id,
                    username: selectedProfile.username
                },
                userData: {
                    userId: auth.user.id,
                    username: auth.user.username
                }
            });
        }
    }, [selectedProfile, auth]);

    // Get the relationship of user with this profile and render the right content
    const [profileStatus, setProfileStatus] = useState('');

    // Get conversation messages
    const [messages, setMessages] = useState([]);
    const [conversationId, setConversationId] = useState('');

    useEffect(() => {
        if (selectedProfile && profileStatus === 'friend') {
            axios.get(`http://localhost:5000/dev-talks/users/${auth.user.id}/conversation/${selectedProfile._id}`).then(res => {
                if (res.data) {
                    setConversationId(res.data.conversationId);
                    setMessages(res.data.messagesByDate);
                } else {
                    setConversationId('');
                    setMessages([]);
                }
            }).catch(err => console.log(err.response));
        }
    }, [selectedProfile, auth.user.id, profileStatus]);

    // Check if user is a friend of the selected profile
    useEffect(() => {
        if (selectedProfile) {
            const isFriend = friends.filter(friend => friend.userId === selectedProfile._id);
            if (isFriend.length !== 0) {
                setProfileStatus('friend');
            }
        }
    }, [socketInstance, selectedProfile, friends]);

    // Check if the profile has sent a friend request to the user
    useEffect(() => {
        if (selectedProfile) {
            const isFriendRequest = friendRequests.filter(friendRequest => friendRequest.userId === selectedProfile._id);
            if (isFriendRequest.length !== 0) {
                setProfileStatus('friend-request');
            }
        }
    }, [selectedProfile, friendRequests]);

    // Check if user has sent a friend request to the profile
    useEffect(() => {
        if (selectedProfile) {
            const isPendingRequest = pendingRequests.filter(pendingRequest => pendingRequest.userId === selectedProfile._id);
            if (isPendingRequest.length !== 0) {
                setProfileStatus('pending-request');
            }
        }
    }, [selectedProfile, pendingRequests]);

    const addFriend = () => {
        sendFriendRequest(friendRequestData, socketInstance, setProfileStatus, setPendingRequests);
    }

    const acceptFriend = () => {
        acceptFriendRequest(friendRequestData, socketInstance, setProfileStatus, setFriends, setFriendRequests);
    }

    const cancelFriend = () => {
        cancelFriendRequest(friendRequestData, socketInstance, setProfileStatus, setPendingRequests);
    }

    const rejectFriend = () => {
        rejectFriendRequest(friendRequestData, socketInstance, setProfileStatus, setFriendRequests)
    }

    const unfriend = () => {
        removeFriend(friendRequestData, socketInstance, setProfileStatus, setFriends, setMessages, setConversationId);
    }

    useEffect(() => {

        const newFriendListener = friendRequestData => {
            if (selectedProfile && selectedProfile._id === friendRequestData.userData.userId) {
                setProfileStatus('friend-request');
            }
        }

        const acceptFriendListener = friendRequestData => {
            if (selectedProfile && selectedProfile._id === friendRequestData.userData.userId) {
                setProfileStatus('friend');
            }
        }

        const rejectFriendListener = friendRequestData => {
            if (selectedProfile && selectedProfile._id === friendRequestData.userData.userId) {
                setProfileStatus('stranger');
            }
        }

        const cancelFriendListener = friendRequestData => {
            if (selectedProfile && selectedProfile._id === friendRequestData.userData.userId) {
                setProfileStatus('stranger');
            }
        }

        const unfriendListener = friendRequestData => {
            if (selectedProfile && selectedProfile._id === friendRequestData.userData.userId) {
                setProfileStatus('stranger');
                // To properly clean up the deleted conversation
                setMessages([]);
                setConversationId('');
            }
        }

        const joinNewConversationListener = data => {
            console.log(data);
            const friendRequestData = data.friendRequestData;
            const conversationId = data.conversationId;
            if (friendRequestData.profileData.userId === auth.user.id) {
                socketInstance.socket.emit('joinNewConversation', conversationId);
            }
        }

        // const newConversationListener = data => {
        //     if (friendRequestData.profileData.userId === auth.user.id) {
        //         socketInstance.socket.emit('joinNewConversation', conversationId);
        //     }
        // }

        // Listen to any incoming friend requests
        socketInstance.socket.on('newFriendRequest', newFriendListener);

        // Listen to any reject of friend request
        socketInstance.socket.on('rejectFriendRequest', rejectFriendListener);

        // Listen to any cancel of friend request
        socketInstance.socket.on('cancelFriendRequest', cancelFriendListener);

        // Listen to any accept of friend request
        socketInstance.socket.on('acceptFriendRequest', acceptFriendListener);

        // Listen to any unfriend
        socketInstance.socket.on('unfriend', unfriendListener);

        socketInstance.socket.on('joinNewConversation', joinNewConversationListener);

        return () => {
            socketInstance.socket.off('newFriendRequest', newFriendListener);
            socketInstance.socket.off('acceptFriendRequest', acceptFriendListener);
            socketInstance.socket.off('cancelFriendRequest', cancelFriendListener);
            socketInstance.socket.off('rejectFriendRequest', rejectFriendListener);
            socketInstance.socket.off('unfriend', unfriendListener);
        }

    }, [socketInstance, selectedProfile, conversationId, auth, friendRequestData]);

    const [typingUser, setTypingUser] = useState({});

    const renderContent = () => {
        switch (profileStatus) {
            case 'friend':
                return <ChatInput type='user' conversationId={conversationId} setTypingUser={setTypingUser} />
            case 'friend-request':
                return (
                    <div className='block-btn-wrapper flex-btns'>
                        <div className='inline-btn-wrapper left'>
                            <Button variant='success' block onClick={acceptFriend}>Accept</Button>
                        </div>
                        <div className='inline-btn-wrapper right'>
                            <Button variant='danger' block onClick={rejectFriend}>Reject</Button>
                        </div>
                    </div>
                )
            case 'pending-request':
                return (
                    <div className='block-btn-wrapper'>
                        <Button variant='danger' block onClick={cancelFriend}>Request pending (Click to cancel)</Button>
                    </div>
                )
            default:
                return (
                    <div className='block-btn-wrapper'>
                        <Button className='join-channel-btn' block onClick={addFriend}>Add Friend</Button>
                    </div>
                )
        }
    }

    return (
        <div>
            {
                selectedProfile
                    ? <Row className="body-wrapper">
                        <Col xs={8}>
                            <ChatBody type='user' conversationId={conversationId} messages={messages} setMessages={setMessages} typingUser={typingUser} />
                            <div>{renderContent()}</div>
                        </Col>
                        <Col xs={4}>
                            <ProfileInfo
                                profileStatus={profileStatus}
                                unfriend={unfriend}
                                username={selectedProfile.username}
                                bio={selectedProfile.bio}
                            />
                        </Col>
                    </Row>
                    : null
            }
        </div>
    )

}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.activeProfile,
    socketInstance: state.socket
})

export default connect(mapStateToProps, null)(ProfileBody);

