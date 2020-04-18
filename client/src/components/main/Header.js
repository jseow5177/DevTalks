import React, {useState} from 'react';

import SearchIcon from '@material-ui/icons/Search';

import Form from 'react-bootstrap/Form';

import FormRow from '../auth/FormRow';

function Header() {

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
                    icon={<SearchIcon/>} 
                    value={query} 
                    handleChange={handleChangeQuery} 
                />
            </Form>
        </div>
    )
}

export default Header;