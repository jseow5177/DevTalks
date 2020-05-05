import React from 'react';
import { connect } from 'react-redux'
import axios from 'axios';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';

import { getDate } from '../../utils/date';

function ChannelInfoIcons({ auth, socketInstance, starred, setStarred, setUserIsMember, channelId }) {

    const leaveChannel = () => {
        const current = new Date().getTime(); // Get the time where the message is sent
        const date = getDate(new Date()); // Get the date where the message is sent

        // Admin message to be saved into db and notify other users that a new user has joined
        const adminMessage = {
            messageType: 'admin',
            from: {
                userId: auth.user.id,
                username: auth.user.username
            },
            message: 'left',
            time: current
        }

        const messageData = {
            channelId: channelId,
            date: date,
            message: adminMessage
        }

        // Save admin message into db
        axios.post(`http://localhost:5000/dev-talks/channels/${channelId}/messages/new-message`, adminMessage).catch(err => {
            console.log(err.response.data);
        });

        // Remove the channel from the user's existing list of channels
        // Remove user from the channel's list of members
        axios.delete(`http://localhost:5000/dev-talks/channels/${channelId}/users/${auth.user.id}/leave?starred=${starred}`).then(res => {
            socketInstance.socket.emit('userLeft', messageData);
            setUserIsMember(false);
            setStarred(false);
        }).catch(err => {
            console.log(err.response.data);
        });

    }

    const toggleStar = () => {

        const starStatus = {
            channelData: {
                channelId: channelId,
            },
            userData: {
                userId: auth.user.id
            },
            starred: starred
        }

        axios.put(`http://localhost:5000/dev-talks/channels/${channelId}/star`, starStatus).then(res => {
            setStarred(!starred);
        }).catch(err => {
            console.log(err);
        });

    }

    return (
        <div className='channel-info-icons-wrapper'>
            <OverlayTrigger placement='top' overlay={<Tooltip>Star</Tooltip>}>
                <button className='star-btn' onClick={toggleStar}>
                    {
                        starred 
                        ? <span className="star orange"><i className="fas fa-star"></i></span> 
                        : <span className="star"><i className="far fa-star"></i></span>
                    }
                </button>
            </OverlayTrigger>
            <OverlayTrigger placement='top' overlay={<Tooltip>Leave</Tooltip>}>
                <button className='leave-btn' onClick={leaveChannel}><MeetingRoomIcon fontSize='large' /></button>
            </OverlayTrigger>
        </div>
    )
}

const mapStateToProps = state => ({
    auth: state.auth,
    socketInstance: state.socket
});

export default connect(mapStateToProps, null)(ChannelInfoIcons);