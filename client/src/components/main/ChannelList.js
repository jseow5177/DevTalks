import React, { useState, useEffect } from 'react';

import Modal from 'react-bootstrap/Modal';

import ChannelListItem from './ChannelListItem';
import sortChannel from '../../utils/sortChannel';

function ChannelList({ groupedChannels, showChannelList, setShowChannelList, searchedChannel, uniqueChannelNames }) {

    const [primaryListItems, setPrimaryListItems] = useState([]);
    const [secondaryListItems, setSecondaryListItems] = useState([]);
    const [noOfResults, setNoOfResults] = useState(0);

    useEffect(() => {
        if (uniqueChannelNames.length !== 0) {

            uniqueChannelNames.sort((x, y) => (x === searchedChannel) ? -1 : (y === searchedChannel) ? 1 : 0);
            let primaryKey = uniqueChannelNames[0].toLowerCase();
            setPrimaryListItems(sortChannel(groupedChannels[primaryKey]));

            let results = [];   
            for (let i = 1; i < uniqueChannelNames.length; i++) {
                const key = uniqueChannelNames[i].toLowerCase();
                const sortedChannelArray = sortChannel(groupedChannels[key]);
                results = [...results, ...sortedChannelArray]
            }
            setSecondaryListItems(results);

        }

    }, [groupedChannels, searchedChannel, uniqueChannelNames]);

    // Measure the length of results
    useEffect(() => {
        setNoOfResults(primaryListItems.length);
    }, [primaryListItems]);


    const closeChannelList = () => {
        setShowChannelList(false);
    }

    return (
        <div>
            <Modal show={showChannelList} onHide={closeChannelList} className='modal-wrapper' centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {noOfResults} {noOfResults > 1 ? 'results' : 'result'} found
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='channel-list-wrapper channel-list-scroll'>
                    {primaryListItems.length !== 0
                        ? primaryListItems.map(channel => <ChannelListItem key={channel.channelId} channel={channel} setShowChannelList={setShowChannelList} />)
                        : null
                    }
                    {secondaryListItems.length !== 0 ? <Modal.Title className='other-results-text'>You might also like...</Modal.Title> : null}
                    {secondaryListItems.length !== 0
                        ? secondaryListItems.map(channel => <ChannelListItem key={channel.channelId} channel={channel} setShowChannelList={setShowChannelList} />)
                        : null
                    }
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default ChannelList;