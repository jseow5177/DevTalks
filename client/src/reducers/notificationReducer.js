import { FIRST_UNREAD } from "../actions/types";

const initialState = {}

export default function (state = initialState, action) {
    switch(action.type) {
        case FIRST_UNREAD:
            return {
                unreadMessages: action.payload
            }
        default: {
            return state;
        }
    };
};