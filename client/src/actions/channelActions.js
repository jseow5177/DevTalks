import { ACTIVE_CHANNEL, NO_ACTIVE_CHANNEL } from "./types";
import axios from 'axios';

// Get the channel currently viewed by user
export const getActiveChannel = (channelId) => {
    return (dispatch) => {
        axios.get(`http://localhost:5000/dev-talks/channels/${channelId}`).then(res => {
            dispatch({
                type: ACTIVE_CHANNEL,
                payload: res.data
            });
        }).catch(err => console.log(err));
    };
};

export const removeActiveChannel = () => {
    return (dispatch) => {
        dispatch({
            type: NO_ACTIVE_CHANNEL,
            payload: null
        });
    };
};

