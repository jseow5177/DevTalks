import { HAS_NOTIFICATIONS } from './types';
import { REMOVE_NOTIFICATIONS } from './types';

export const sendNotifications = (channelId) => {
    return (dispatch) => {
        dispatch({
            type: HAS_NOTIFICATIONS,
            payload: channelId
        });
    };
};

export const clearNotifications = (channelId) => {
    return (dispatch) => {
        dispatch({
            type: REMOVE_NOTIFICATIONS,
            payload: channelId
        });
    };
};