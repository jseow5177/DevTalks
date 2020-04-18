import { ACTIVE_CHANNEL } from "./types";
import axios from 'axios';

// Initialise user socket
export const getActiveChannel = (channelId) => {
    return (dispatch) => {
        axios.get(`http://localhost:5000/dev-talks/channels/${channelId}`).then(res => {
            dispatch({
                type: ACTIVE_CHANNEL,
                payload: res.data
            });
        }).catch(err => {
            console.log(err.response.data);
        });
    }
}