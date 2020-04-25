import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import axios from 'axios';

import { startSocket } from '../../actions/socketActions';

import SideBar from './SideBar';
import Header from './Header';
import Body from './Body';

function HomePage({ startSocket, auth }) {

    const [joinedChannels, setJoinedChannels] = useState([]);
    const [starredChannels, setStarredChannels] = useState([]);
    const [someoneJoinedChannel, setSomeoneJoinedChannel] = useState("");
    const ENDPOINT = 'localhost:5000';

    useEffect(() => {
        const socket = io(ENDPOINT);

        socket.on('connect', () => {
            startSocket(socket);
        });

        return () => {
            socket.emit('disconnect');
        }

    }, [startSocket]);

    useEffect(() => {

        axios.get(`http://localhost:5000/dev-talks/users/${auth.user.id}/channels/`).then(res => {
            const userChannels = res.data;
            setJoinedChannels(userChannels.joinedChannels);
            setStarredChannels(userChannels.starredChannels);
        }).catch(err => {
            console.log(err);
        });

    }, [auth.user.id, someoneJoinedChannel]);

    return (
        <div className="main">
            <Header />
            <SideBar 
                joinedChannels={joinedChannels} 
                starredChannels={starredChannels}
                setJoinedChannels={setJoinedChannels}
                setStarredChannels={setStarredChannels} />
            <Body
                someoneJoinedChannel={someoneJoinedChannel} 
                setSomeoneJoinedChannel={setSomeoneJoinedChannel} />
        </div>
    )
}

const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch) => {
    return {
        startSocket: (socketId) => dispatch(startSocket(socketId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);