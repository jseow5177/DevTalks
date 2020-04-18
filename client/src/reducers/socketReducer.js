import { USER_ONLINE } from '../actions/types';

const initialState = {
    socket: null,
}

export default function(state = initialState, action) {
    switch(action.type) {
        case USER_ONLINE:
            return {
                socket: action.payload
            };
        default:
            return state;
    }
}