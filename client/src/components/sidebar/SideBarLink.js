import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { getActiveChannel } from '../../actions/channelActions';
import { clearNotifications } from '../../actions/notificationActions';

function SideBarLink({ channel, notifications, getActiveChannel, clearNotifications }) {

    const [channelNotifications, setChannelNotifications] = useState('');

    // Handle user notifications when they receive messages from inactive channel (i.e. channel not shown on main body)
    useEffect(() => {
        setChannelNotifications(notifications[channel.channelId]);
    }, [notifications, channel])

    // When user opened a channel, any notifications from it are removed
    const renderChannel = event => {
        getActiveChannel(event.target.id);
        clearNotifications(channel.channelId);
        setChannelNotifications(notifications[channel.channelId]); 
    }

    return (
        <div>
            <h6>
                <button id={channel.channelId} className='sidebar-link' onClick={renderChannel}>
                    {`# ${channel.channelName}`}
                </button>
                { 
                    notifications[channel.channelId] 
                        ? <div className='notification-wrapper'>
                            {channelNotifications}
                          </div>
                        : null
                }
            </h6>
        </div>
    )

}

const mapStateToProps = (state) => ({
    notifications: state.notifications
});

const mapDispatchToProps = (dispatch) => {
    return {
        getActiveChannel: (channelId) => dispatch(getActiveChannel(channelId)),
        clearNotifications: (channelId) => dispatch(clearNotifications(channelId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBarLink);