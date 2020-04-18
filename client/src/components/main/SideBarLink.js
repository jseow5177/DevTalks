import React from 'react';
import { getActiveChannel } from '../../actions/channelActions';
import { connect } from 'react-redux';

function SideBarLink({ starredChannels, getActiveChannel }) {

    const renderChannel = event => {
        getActiveChannel(event.target.id);
    }

    return (
        <div className="sidebar-link-wrapper">
            {starredChannels.length !== 0
                ? starredChannels.map(starredChannel => <h6 key={starredChannel.channelId}>
                    <button id={starredChannel.channelId} className="sidebar-link" onClick={renderChannel}>{`# ${starredChannel.channelName}`}</button></h6>)
                : <h6>(No channels found)</h6>}
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        getActiveChannel: (channelId) => dispatch(getActiveChannel(channelId))
    }
}

export default connect(null, mapDispatchToProps)(SideBarLink);