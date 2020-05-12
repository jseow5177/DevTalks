import React from 'react';
import { connect } from 'react-redux'
import axios from 'axios';
import { v1 as uuidv1 } from 'uuid';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';

import { getDate } from '../../utils/date';

function ChannelInfoIcons({ auth, socketInstance, channelId, channelName, starred, setStarred, setUserIsMember, setJoinedChannels, setStarredChannels }) {

    const leaveChannel = () => {
        const current = new Date().getTime(); // Get the time where the message is sent
        const date = getDate(new Date()); // Get the date where the message is sent

        const userData = {
            userId: auth.user.id,
            username: auth.user.username
        }

        // Admin message to be saved into db and notify other users that a new user has joined
        const adminMessage = {
            _id: uuidv1(),
            messageType: 'admin',
            from: userData,
            message: 'left',
            time: current
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

        // Remove the channel from the user's existing list of channels
        // Remove user from the channel's list of members
        axios.delete(`http://localhost:5000/dev-talks/channels/${channelId}/users/${auth.user.id}/leave?starred=${starred}`).then(res => {
            socketInstance.socket.emit('userLeft', messageData);
            setUserIsMember(false);
            setStarred(false);
            setJoinedChannels(joinedChannels => joinedChannels.filter(joinedChannel => joinedChannel.channelId !== channelId));
            if (starred) {
                setStarredChannels(starredChannels => starredChannels.filter(starredChannel => starredChannel.channelId !== channelId));
            }
        
        }).catch(err => {
            console.log(err.response.data);
        });

    }

    const toggleStar = () => {
        if (starred) {
            setStarredChannels(starredChannels => starredChannels.filter(starredChannel => starredChannel.channelId !== channelId));
        } else {
            const newStarredChannel = {
                channelId: channelId,
                channelName: channelName,
                starred: true
            }
            setStarredChannels(starredChannels => [...starredChannels, newStarredChannel]);
        }
        axios.put(`http://localhost:5000/dev-talks/channels/${channelId}/users/${auth.user.id}/star?starred=${starred}`).then(res => {
            setStarred(!starred);
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <div className='info-icons-wrapper'>
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