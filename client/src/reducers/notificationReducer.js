import { HAS_NOTIFICATIONS, REMOVE_NOTIFICATIONS } from "../actions/types";

const initialState = {}

export default function (state = initialState, action) {
    switch(action.type) {
        case HAS_NOTIFICATIONS:
            if (!state[action.payload]) {
                return {
                    ...state,
                    [action.payload]: 1
                };
            } else {
                return {
                    ...state,
                    [action.payload]: state[action.payload] + 1
                };
            }
        case REMOVE_NOTIFICATIONS:
            delete state[action.payload];
            return state;
        default: {
            return state;
        }
    };
};