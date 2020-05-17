import {combineReducers} from 'redux';
import socketReducer from './socketReducer';
import channelReducer from './channelReducer';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import notificationReducer from './notificationReducer';
import profileReducer from './profileReducer';

export default combineReducers({
    socket: socketReducer,
    activeChannel: channelReducer,
    auth: authReducer,
    errors: errorReducer,
    notification: notificationReducer,
    activeProfile: profileReducer
});