import React, { useEffect } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';

import { startSocket } from '../../actions/socketActions';

import SideBar from './SideBar';
import Header from './Header';
import Body from './Body';

function HomePage({ startSocket }) {

    const ENDPOINT = 'localhost:5000';

    useEffect(() => {
        const socket = io(ENDPOINT);

        socket.on('connect', () => {
            startSocket(socket);
        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        }

    }, [startSocket]);

    return (
        <div className="main">
            <Header />
            <SideBar />
            <Body />
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        startSocket: (socketId) => dispatch(startSocket(socketId))
    }
}

export default connect(null, mapDispatchToProps)(HomePage);