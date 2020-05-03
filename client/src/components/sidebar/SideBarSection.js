import React, { useState, useEffect } from 'react';

import SideBarLink from './SideBarLink';

function SideBarSection({ channels, star, showJoinedChannelSection, showStarredChannelSection }) {

    const [channelsToBeDisplayed, setChannelsToBeDisplayed] = useState([]);

    useEffect(() => {
        if (star) {
            const starredChannels = channels.filter(channel => channel.starred);
            setChannelsToBeDisplayed(starredChannels);
        } else {
            setChannelsToBeDisplayed(channels);
        }
    }, [channels, star]);

    return (
        <div className='sidebar-link-wrapper'>
            {
                showJoinedChannelSection || (star && showStarredChannelSection)
                    ? channelsToBeDisplayed.length !== 0
                        ? channelsToBeDisplayed.map(channel => <SideBarLink key={channel.channelId} channel={channel} />)
                        : <h6 className='sidebar-link'>(No channels found)</h6>
                    : null
            }
        </div>
    )
}

export default SideBarSection;