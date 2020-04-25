import React, { useState, useEffect } from 'react';
//import axios from 'axios';
import { connect } from 'react-redux';

import AddChannel from './AddChannel';
import SideBarLink from './SideBarLink';

import CodeIcon from '@material-ui/icons/Code';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import ForumIcon from '@material-ui/icons/Forum';
import EmailIcon from '@material-ui/icons/Email';
import AddRoundedIcon from '@material-ui/icons/AddRounded';

function SideBar({ socketInstance, auth, joinedChannels, starredChannels, setJoinedChannels, setStarredChannels }) {

    const [showAddChannel, setShowAddChannel] = useState(false);

    // Add user socket to the all his or her channels
    useEffect(() => {
        if (socketInstance.socket) {
            socketInstance.socket.emit('joinChannel', joinedChannels);
        }
    }, [joinedChannels, socketInstance.socket]);

    // Show add channel form
    const addChannel = () => {
        setShowAddChannel(true);
    }

    return (
        <div>
            <div className="sidebar-wrapper">
                <div className="sidebar-title">
                    <h2 className="app-name"><CodeIcon className="logo" />Dev Talks</h2>
                </div>
                <div className="sidebar-section">
                    <h5><StarRoundedIcon className="icon" />Starred</h5>
                    <SideBarLink channels={starredChannels} />
                </div>
                <div className="sidebar-section">
                    <h5><ForumIcon className="icon" />Channels<AddRoundedIcon className="icon add-icon" onClick={addChannel} /></h5>
                    <SideBarLink channels={joinedChannels} />
                </div>
                <div className="sidebar-section">
                    <h5><EmailIcon className="icon" />Direct Messages</h5>
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
    auth: state.auth,
});

export default connect(mapStateToProps, null)(SideBar);