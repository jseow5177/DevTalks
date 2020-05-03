import React, { useState, useEffect } from 'react';

import Modal from 'react-bootstrap/Modal';

import ChannelListItem from './ChannelListItem';

function ChannelList({ groupedChannels, showChannelList, setShowChannelList, searchedChannel }) {

    const [channelListItems, setChannelListItems] = useState([]);

    useEffect(() => {
        const key = searchedChannel.toLowerCase();
        console.log(key);
        if (groupedChannels[key]) {
            const sortedChannelArray = groupedChannels[key];
            // Sort array by noOfMembers first
            // If noOfMembers are equals, then sort by number of stars
            // Sort in descending order
            sortedChannelArray.sort((a, b) => (a.noOfMembers > b.noOfMembers) ? -1 : (a.noOfMembers === b.noOfMembers) ? ((a.stars > b.stars) ? -1 : 1) : 1);
            setChannelListItems(sortedChannelArray);
        }
    }, [groupedChannels, searchedChannel, setChannelListItems]);

    const closeChannelList = () => {
        setShowChannelList(false);
    }

    return (
        <div>
            <Modal show={showChannelList} onHide={closeChannelList} className="add-channel-wrapper" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {channelListItems.length} {channelListItems.length > 1 ? 'results' : 'result'} found
                        <p className='modal-title-cta'>Click for more info</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='channel-list-wrapper channel-list-scroll'>
                    {channelListItems.length !== 0
                        ? channelListItems.map(channel => <ChannelListItem key={channel.channelId} channel={channel} setShowChannelList={setShowChannelList} />)
                        : null
                    }
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default ChannelList;