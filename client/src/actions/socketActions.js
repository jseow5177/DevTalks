import { USER_ONLINE } from "./types";

// Initialise user socket so that it is accessible across all components
export const startSocket = (socket) => dispatch => {
    dispatch({
        type: USER_ONLINE,
        payload: socket
    });
};