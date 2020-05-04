import React from 'react';
import { connect } from 'react-redux';

import { getActiveChannel, removeActiveChannel } from '../../actions/channelActions';
import { getActiveProfile, removeActiveProfile } from '../../actions/profileActions';

function SideBarNav({ type, item, getActiveChannel, getActiveProfile, removeActiveChannel, removeActiveProfile }) {

    const showActive = (event) => {
        if (type === 'channel') {
            getActiveChannel(event.target.id);
            removeActiveProfile();
        } else {
            getActiveProfile(event.target.id);
            removeActiveChannel();
        }
    }

    return (
        <div>
            <h6>
                <button id={type==='channel' ? item.channelId : item.userId} className='sidebar-link' onClick={showActive}>
                    {type==='channel' ? `# ${item.channelName}` : `@ ${item.username}`}
                </button>
            </h6>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        getActiveChannel: (channelId) => dispatch(getActiveChannel(channelId)),
        getActiveProfile: (userId) => dispatch(getActiveProfile(userId)),
        removeActiveProfile: () => dispatch(removeActiveProfile()),
        removeActiveChannel: () => dispatch(removeActiveChannel())
    }
}

export default connect(null, mapDispatchToProps)(SideBarNav);