import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import { GET_ERRORS, SET_CURRENT_USER } from './types';

// Register user
export const registerUser = (userData, history) => {
    return (dispatch) => {
        axios.post('http://localhost:5000/users/register', userData)
             .then(res => history.push('/'))
             .catch(err => dispatch({
                 type: GET_ERRORS,
                 payload: err.response.data
             }));
    };
};

// Login user and set up token
export const loginUser = userData => {
    return (dispatch) => {
        axios.post('http://localhost:5000/users/login', userData)
             .then(res => {
                 // Successful login returns an object {success: ..., token: ...}
                 const {token} = res.data;
                 // Save token to browser local storage
                 localStorage.setItem('jwtToken', token);
                 // Save token to auth header
                 setAuthToken(token);
                 // Decode token to get user info
                 const decoded = jwt_decode(token);
                 // Set current user
                 dispatch(setCurrentUser(decoded));
             })
             .catch(err => dispatch({
                 type: GET_ERRORS,
                 payload: err.response.data
             }));
    };
};

// Logout user
export const logoutUser = () => {
    return (dispatch) => {
        // Remove token from localStorage
        localStorage.removeItem('jwtToken');
        // Remove token from auth header
        setAuthToken(false);
        // Pass empty object to setCurrentUser. Will set isAuthenticated to false
        dispatch(setCurrentUser({}));
    }
}

const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

/*
const setUserLoading = () => {
    return {
        type: USER_LOADING
    };
};
*/

