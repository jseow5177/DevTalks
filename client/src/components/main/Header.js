import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import _ from 'lodash';

import SearchIcon from '@material-ui/icons/Search';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import Form from 'react-bootstrap/Form';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import ChannelList from './ChannelList';
import FormRow from '../auth/FormRow';
import SearchResult from './SearchResult';
import { logoutUser } from '../../actions/authActions';
import { removeActiveChannel } from '../../actions/channelActions';

function Header({ logoutUser, removeActiveChannel }) {

    const [query, setQuery] = useState('');
    const [allChannelNames, setAllChannelNames] = useState([]); // Hold the names of all channels
    const [groupedChannels, setGroupedChannels] = useState({}); // Hold the info of channels grouped by their names
    const [uniqueChannelNames, setUniqueChannelNames] = useState('');
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

    // Form doesn't submit on enter
    const removeEnterKey = (e) => {
        e.preventDefault();
    }

    const handleChangeQuery = (event) => {
        setQuery(event.target.value);
    }

    // When search bar is clicked, get all the available channels
    const getAllChannels = () => {
        axios.get('http://localhost:5000/dev-talks/channels').then(res => {
            const channels = res.data;
            const groupedChannels = {};
            const channelNames = [];
            channels.forEach(channel => {
                const channelName = channel.channelName.toLowerCase();
                if (groupedChannels[channelName]) {
                    groupedChannels[channelName].push(channel);
                } else {
                    groupedChannels[channelName] = [channel]
                }
                console.log(channelName);
                channelNames.push(_.startCase(channelName));
            });
            setAllChannelNames(channelNames);
            setGroupedChannels(groupedChannels);
        }).catch(err => {
            console.log(err.response.data);
        });
    }

    // Close search results when an option is clicked
    const closeSearchResults = () => {
        setQuery('');
    }

    const logOut = () => {
        logoutUser();
        removeActiveChannel();
    }

    useEffect(() => {
        const filteredChannels = allChannelNames.filter(channelName => {
            return channelName.toLowerCase().indexOf(query.toLowerCase()) !== -1;
        });
        console.log(filteredChannels);
        const uniqueChannelNames = [...new Set(filteredChannels)];
        setUniqueChannelNames(uniqueChannelNames);
    }, [allChannelNames, query]);

    

    return (
        <div className="header-wrapper">
            <Form className="search-bar" onClick={getAllChannels} onSubmit={removeEnterKey}>
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
                            <SearchResult key={index} channelName={channelName} setShowChannelList={setShowChannelList} setSearchedChannel={setSearchedChannel} />)}
                    </div>
            }
            <ChannelList showChannelList={showChannelList} setShowChannelList={setShowChannelList} groupedChannels={groupedChannels} searchedChannel={searchedChannel} />
            <OverlayTrigger placement='left' overlay={<Tooltip>Logout</Tooltip>}>
                <button className='logout-btn' onClick={logOut}><ExitToAppIcon fontSize='large' /></button>
            </OverlayTrigger>
        </div>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        logoutUser: () => dispatch(logoutUser()),
        removeActiveChannel: () => dispatch(removeActiveChannel())
    }
}

export default connect(null, mapDispatchToProps)(Header);