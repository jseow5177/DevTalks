import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import AddChannel from './AddChannel';
import SideBarSection from './SideBarSection';

import CodeIcon from '@material-ui/icons/Code';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import ForumIcon from '@material-ui/icons/Forum';
import EmailIcon from '@material-ui/icons/Email';
import AddRoundedIcon from '@material-ui/icons/AddRounded';

function SideBar({ socketInstance, joinedChannels, setJoinedChannels }) {

    // When + sign is clicked, show AddChannel
    const [showAddChannel, setShowAddChannel] = useState(false);
    const [showJoinedChannelSection, setShowJoinedChannelSection] = useState(false);
    const [showStarredChannelSection, setShowStarredChannelSection] = useState(false);

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

    const toggleShowJoinedChannelSection = () => {
        setShowJoinedChannelSection(!showJoinedChannelSection);
    }

    const toggleShowStarredChannelSection = () => {
        setShowStarredChannelSection(!showStarredChannelSection);
    }

    return (
        <div>
            <div className='sidebar-wrapper sidebar-scroll'>

                <div className='sidebar-title'>
                    <h2 className='app-name'><CodeIcon className='logo' />Dev Talks</h2>
                </div>

                <div className='sidebar-section'>
                    <h5 className='sidebar-dropdown' onClick={toggleShowStarredChannelSection}>
                        <i className={'icon fas fa-caret-right ' + (showStarredChannelSection ? 'open' : null)}></i> Starred
                    </h5>
                    <SideBarSection channels={joinedChannels} star={true} showStarredChannelSection={showStarredChannelSection} />
                </div>

                <hr/>

                <div className='sidebar-section'>
                    <h5 className='sidebar-dropdown' onClick={toggleShowJoinedChannelSection}>
                        <i className={'icon fas fa-caret-right ' + (showJoinedChannelSection ? 'open' : null)}></i> Channels
                    </h5>
                    <SideBarSection channels={joinedChannels} star={false} showJoinedChannelSection={showJoinedChannelSection} />
                    <OverlayTrigger placement='right' overlay={<Tooltip>Add Channel</Tooltip>}>
                        <AddRoundedIcon className='icon add-icon' onClick={addChannel} />
                    </OverlayTrigger>
                </div>

                <hr/>

                <div className='sidebar-section'>
                    <h5><EmailIcon className='icon' />Direct Messages</h5>
                </div>

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