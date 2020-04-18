import { ACTIVE_CHANNEL } from '../actions/types';

const initialState = {
    activeChannel: null,
}

export default function(state = initialState, action) {
    switch(action.type) {
        case ACTIVE_CHANNEL:
            return {
                activeChannel: action.payload
            };
        default:
            return state;
    }
}