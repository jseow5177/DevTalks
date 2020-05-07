import { VIEW_PROFILE, NO_VIEW_PROFILE } from '../actions/types';

const initialState = {
    activeProfile: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case VIEW_PROFILE:
            return {
                ...state,
                activeProfile: action.payload
            };
        case NO_VIEW_PROFILE:
            return {
                ...state,
                activeProfile: action.payload
            }
        default:
            return state;
    }
}