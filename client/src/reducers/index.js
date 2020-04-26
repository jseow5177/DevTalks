import {combineReducers} from 'redux';
import socketReducer from './socketReducer';
import channelReducer from './channelReducer';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import notificationReducer from './notificationReducer';

export default combineReducers({
    socket: socketReducer,
    activeChannel: channelReducer,
    auth: authReducer,
    errors: errorReducer,
    notifications: notificationReducer
});