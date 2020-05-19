import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import SearchIcon from '@material-ui/icons/Search';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import Form from 'react-bootstrap/Form';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import ChannelList from './ChannelList';
import FormRow from '../main/FormRow';
import SearchResult from './SearchResult';
import { logoutUser } from '../../actions/authActions';
import { removeActiveChannel } from '../../actions/channelActions';
import { removeActiveProfile } from '../../actions/profileActions';

function Header({ logoutUser, removeActiveChannel, removeActiveProfile, allChannels }) {

    const [query, setQuery] = useState('');
    const [allChannelNames, setAllChannelNames] = useState([]); // Hold the names of all channels
    const [groupedChannels, setGroupedChannels] = useState({}); // Hold the info of channels grouped by their names
    const [uniqueChannelNames, setUniqueChannelNames] = useState([]);
    const [showChannelList, setShowChannelList] = useState(false);
    const [searchedChannel, setSearchedChannel] = useState('');

    // If clicked outside of search results, div will close
    useEffect(() => {
        window.addEventListener('click', e => {
            const div = document.querySelector('.search-results-wrapper');
            if (div) {
                if (!(div.contains(e.target))) {
                    setQuery(''); // When no query, div will close
                }
            }
        });
    }, []);

    // Group all channels by their names
    useEffect(() => {
        const groupedChannels = {};
        const channelNames = [];
        allChannels.forEach(channel => {
            const channelName = channel.channelName.toLowerCase();
            if (groupedChannels[channelName]) {
                groupedChannels[channelName].push(channel);
            } else {
                groupedChannels[channelName] = [channel]
            }
            channelNames.push(channelName.replace(/\w+/g, _.capitalize)); // Capitalize the channel names
        });
        setAllChannelNames(channelNames);
        setGroupedChannels(groupedChannels); // Group channels by their names
    }, [allChannels]);

    // Show unique search results based on user query
    useEffect(() => {
        if (query) {
            const filteredChannels = allChannelNames.filter(channelName => {
                return channelName.toLowerCase().indexOf(query.toLowerCase()) !== -1;
            });
            const uniqueChannelNames = [...new Set(filteredChannels)];
            setUniqueChannelNames(uniqueChannelNames);
        }
    }, [allChannelNames, query]);

    // Form doesn't submit on enter
    const removeEnterKey = (e) => {
        e.preventDefault();
    }

    const handleChangeQuery = (event) => {
        setQuery(event.target.value);
    }

    // Close search results when an option is clicked
    const closeSearchResults = () => {
        setQuery('');
    }

    const logOut = () => {
        logoutUser();
        removeActiveChannel();
        removeActiveProfile();
    }

    return (
        <div className="header-wrapper">
            <Form className="search-bar" onSubmit={removeEnterKey}>
                <FormRow
                    id="query"
                    type="search"
                    placeholder="Search for a channel"
                    icon={<SearchIcon />}
                    value={query}
                    handleChange={handleChangeQuery}
                />
            </Form>
            {
                (query === '')
                    ? null
                    : <div className="search-results-wrapper" onClick={closeSearchResults}>
                        {uniqueChannelNames.length === 0 ? <div className='search-result-wrapper'>(No channels found)</div> : null}
                        {uniqueChannelNames.map((channelName, index) =>
                            <SearchResult
                                key={index}
                                channelName={channelName}
                                setShowChannelList={setShowChannelList}
                                setSearchedChannel={setSearchedChannel}
                            />)}
                    </div>
            }
            <ChannelList
                showChannelList={showChannelList}
                setShowChannelList={setShowChannelList}
                groupedChannels={groupedChannels}
                searchedChannel={searchedChannel}
                uniqueChannelNames={uniqueChannelNames}
            />
            <OverlayTrigger placement='left' overlay={<Tooltip>Logout</Tooltip>}>
                <button className='logout-btn' onClick={logOut}><ExitToAppIcon fontSize='large' /></button>
            </OverlayTrigger>
        </div>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        logoutUser: () => dispatch(logoutUser()),
        removeActiveChannel: () => dispatch(removeActiveChannel()),
        removeActiveProfile: () => dispatch(removeActiveProfile())
    }
}

export default connect(null, mapDispatchToProps)(Header);