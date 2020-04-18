import { USER_ONLINE } from "./types";

// Initialise user socket
export const startSocket = (socket) => dispatch => {
    dispatch({
        type: USER_ONLINE,
        payload: socket
    });
};