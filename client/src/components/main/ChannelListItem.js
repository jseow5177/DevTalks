import React from 'react'
import { connect } from 'react-redux';

import { getActiveChannel } from '../../actions/channelActions';
import { removeActiveProfile } from '../../actions/profileActions';

function ChannelListItem({ channel, getActiveChannel, setShowChannelList, removeActiveProfile }) {

    const renderChannel = () => {
        getActiveChannel(channel.channelId);
        removeActiveProfile();
        setShowChannelList(false);
    }

    return (
        <div className='channel-list-item-wrapper' onClick={renderChannel}>
            <div className='wrapper-top'>
                <span className='channel-name'>{channel.channelName}</span>
                <div>
                    <span><i className="fas fa-users"></i> {channel.noOfMembers} {channel.noOfMembers > 1 ? 'members' : 'member'} </span>
                    <span> <i className="fas fa-star orange"></i> {channel.stars} {channel.stars > 1 ? 'stars' : 'star'}</span>
                </div>
            </div>
            <p className='channel-description'>{channel.channelDescription.substring(0, 110)} {channel.channelDescription.length > 110 ? '...' : ''}</p>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        getActiveChannel: (channelId) => dispatch(getActiveChannel(channelId)),
        removeActiveProfile: () => dispatch(removeActiveProfile())
    }
}

export default connect(null, mapDispatchToProps)(ChannelListItem);