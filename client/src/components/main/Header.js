import React, { useState } from 'react';
import { connect } from 'react-redux';

import SearchIcon from '@material-ui/icons/Search';

import Form from 'react-bootstrap/Form';

import FormRow from '../auth/FormRow';
import { logoutUser } from '../../actions/authActions';

function Header({ logoutUser }) {

    const [query, setQuery] = useState("");

    const handleChangeQuery = (event) => {
        setQuery(event.target.value);
    }

    return (
        <div className="header-wrapper">
            <Form>
                <FormRow
                    id="query"
                    type="search"
                    placeholder="Search for a channel"
                    icon={<SearchIcon />}
                    value={query}
                    handleChange={handleChangeQuery}
                />
            </Form>
            <button onClick={logoutUser}>Logout</button>
        </div>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        logoutUser: () => dispatch(logoutUser())
    }
}

export default connect(null, mapDispatchToProps)(Header);