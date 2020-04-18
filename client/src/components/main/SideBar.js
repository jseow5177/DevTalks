import React, { useState, useEffect } from 'react';
import axios from 'axios';

import AddChannel from './AddChannel';
import SideBarLink from './SideBarLink';

import CodeIcon from '@material-ui/icons/Code';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import ForumIcon from '@material-ui/icons/Forum';
import EmailIcon from '@material-ui/icons/Email';
import AddRoundedIcon from '@material-ui/icons/AddRounded';

function SideBar() {

    const [showAddChannel, setShowAddChannel] = useState(false);
    const [joinedChannels, setJoinedChannels] = useState([]);
    const [starredChannels, setStarredChannels] = useState([]);


    // Get all channels of users
    useEffect(() => {

        axios.get('http://localhost:5000/dev-talks/channels/').then(res => {           
            const channels = res.data;
            setJoinedChannels(channels.joinedChannels);
            setStarredChannels(channels.starredChannels);
        }).catch(err => {
            console.log(err.response.data);
        });

    }, []);

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
                    <SideBarLink starredChannels={starredChannels} />
                </div>
                <div className="sidebar-section">
                    <h5><ForumIcon className="icon" />Channels<AddRoundedIcon className="icon add-icon" onClick={addChannel} /></h5>
                    <SideBarLink starredChannels={joinedChannels} />
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

export default SideBar;