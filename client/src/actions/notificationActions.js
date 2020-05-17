import { FIRST_UNREAD } from './types';

export const scrollToFirstUnread = messageId => {
    return (dispatch) => {
        dispatch({
            type: FIRST_UNREAD,
            payload: messageId
        });
    };
};