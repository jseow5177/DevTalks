import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import SearchIcon from '@material-ui/icons/Search';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import Form from 'react-bootstrap/Form';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import FormRow from '../auth/FormRow';
import SearchResult from './SearchResult';
import { logoutUser } from '../../actions/authActions';
import { removeActiveChannel } from '../../actions/channelActions';

function Header({ logoutUser, removeActiveChannel }) {

    const [query, setQuery] = useState("");
    const [allChannels, setAllChannels] = useState([]);
    const logoutBtn = useRef(null);

    // If clicked outside of search results, div will close
    window.addEventListener('click', e => {
        const div = document.querySelector('.search-results-wrapper');
        if (div) {
            if (!(div.contains(e.target))) {
                setQuery('');
            }
        }
    });

    const handleChangeQuery = (event) => {
        setQuery(event.target.value);
    }

    // When search bar is clicked, get all the available channels
    const getAllChannels = () => {
        axios.get('http://localhost:5000/dev-talks/channels').then(res => {
            setAllChannels(res.data);
        }).catch(err => {
            console.log(err.response.data);
        });
    };

    // Close search results when an option is clicked
    const closeSearchResults = () => {
        setQuery('');
    }

    const logOut = () => {
        logoutUser();
        removeActiveChannel();
    }

    // Filter channels found based on user query
    let filteredChannels = allChannels.filter(channel => {
        return channel.channelName.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });

    return (
        <div className="header-wrapper">
            <Form className="search-bar" onClick={getAllChannels}>
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
                (query === "" || filteredChannels.length === 0)
                    ? null
                    : (<div className="search-results-wrapper" onClick={closeSearchResults}>
                        {filteredChannels.length === 0 ? <p>No results found</p> : null}
                        {filteredChannels.map((channel, index) => <SearchResult key={index} channel={channel} />)}
                    </div>)
            }
            <OverlayTrigger
                placement='left'
                overlay={
                    <Tooltip>
                        Logout
                    </Tooltip>
                }
            >
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