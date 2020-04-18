import {combineReducers} from 'redux';
import socketReducer from './socketReducer';
import channelReducer from './channelReducer';

export default combineReducers({
    socket: socketReducer,
    activeChannel: channelReducer
});