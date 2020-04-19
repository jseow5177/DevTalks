// Set or delete authorization header for axios requests

import axios from 'axios';

const setAuthToken = token => {
    if (token) {
        // When logged in, a token is generated
        // This one line of code applies the authorization token to every request
        axios.defaults.headers.common['Authorization'] = token;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

export default setAuthToken;