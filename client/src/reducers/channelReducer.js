import { ACTIVE_CHANNEL, NO_ACTIVE_CHANNEL } from '../actions/types';

const initialState = {
    activeChannel: null,
}

export default function(state = initialState, action) {
    switch(action.type) {
        case ACTIVE_CHANNEL:
            return {
                ...state,
                activeChannel: action.payload
            };
        case NO_ACTIVE_CHANNEL:
            return {
                ...state,
                activeChannel: action.payload
            }
        default:
            return state;
    }
}