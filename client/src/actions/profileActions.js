import { VIEW_PROFILE, NO_VIEW_PROFILE } from './types';
import axios from 'axios';

// Get the profile currently viewed by user
export const getActiveProfile = (userId) => {
    return (dispatch) => {
        axios.get(`http://localhost:5000/users/${userId}`).then(res => {
            dispatch({
                type: VIEW_PROFILE,
                payload: res.data
            });
        }).catch(err => console.log(err));
    };
};

export const removeActiveProfile = () => {
    return (dispatch) => {
        dispatch({
            type: NO_VIEW_PROFILE,
            payload: null
        });
    };
};