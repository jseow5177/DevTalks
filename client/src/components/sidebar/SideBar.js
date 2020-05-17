import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import AddChannel from './AddChannel';

import SideBarSection from './SideBarSection';

import CodeIcon from '@material-ui/icons/Code';
import AddRoundedIcon from '@material-ui/icons/AddRounded';

function SideBar({ socketInstance, joinedChannels, setJoinedChannels, starredChannels, friends, friendRequests }) {

    const [showJoinedChannelSection, setShowJoinedChannelSection] = useState(false);
    const [showStarredChannelSection, setShowStarredChannelSection] = useState(false);
    const [showFriendsSection, setShowFriendsSection] = useState(false);
    const [showFriendRequestsSection, setShowFriendRequestsSection] = useState(false);

    // When + sign is clicked, show AddChannel
    const [showAddChannel, setShowAddChannel] = useState(false);

    // Add user socket to the all his or her channels
    useEffect(() => {
        if (socketInstance.socket) {
            socketInstance.socket.emit('joinChannel', joinedChannels);
        }
    }, [joinedChannels, socketInstance.socket]);

    // Show AddChannel form
    const addChannel = () => {
        setShowAddChannel(true);
    }

    return (
        <div>
            <div className='sidebar-wrapper sidebar-scroll'>

                <div className='sidebar-title'>
                    <h2 className='app-name'><CodeIcon className='logo' />Dev Talks</h2>
                </div>

                <SideBarSection
                    show={showStarredChannelSection}
                    setShow={setShowStarredChannelSection}
                    sectionTitle='Starred'
                    items={starredChannels}
                    type='channel'
                    placeholder='channels'
                    star={true}
                />

                <hr />

                <SideBarSection
                    show={showJoinedChannelSection}
                    setShow={setShowJoinedChannelSection}
                    sectionTitle='Channels'
                    items={joinedChannels}
                    type='channel'
                    placeholder='channels'
                />

                <OverlayTrigger placement='right' overlay={<Tooltip>Add Channel</Tooltip>}>
                    <AddRoundedIcon className='icon add-icon' onClick={addChannel} />
                </OverlayTrigger>

                <hr />

                <SideBarSection
                    show={showFriendsSection}
                    setShow={setShowFriendsSection}
                    sectionTitle='Friends'
                    items={friends}
                    type='user'
                    placeholder='friends'
                />

                <hr />

                <SideBarSection
                    show={showFriendRequestsSection}
                    setShow={setShowFriendRequestsSection}
                    sectionTitle='Friend Requests'
                    items={friendRequests}
                    type='user'
                    placeholder='requests'
                    // A special prop for friend request section
                    request={true}
                />

            </div>
            <AddChannel
                showAddChannel={showAddChannel}
                setShowAddChannel={setShowAddChannel}
                setJoinedChannels={setJoinedChannels}
            />

        </div>
    )
}

const mapStateToProps = state => ({
    socketInstance: state.socket,
});

export default connect(mapStateToProps, null)(SideBar);