import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import SideBarNav from './SideBarNav'

function SideBarSection({ setShow, show, sectionTitle, items, type, placeholder, request, auth, socketInstance }) {

    // Set total unread messages for each section
    const [totalUnreads, setTotalUnreads] = useState(0);

    // Listen for friend requests
    // Only applicable for section on friend requests
    const [friendRequestCount, setFriendRequestCount] = useState(0);

    // Get user's friend requests
    useEffect(() => {
        
        if (request) setFriendRequestCount(items.length);

    }, [auth.user, request, items]);

    // Listen for friend requests from other users
    useEffect(() => {

        if (socketInstance.socket && request) {
            const friendRequestListener = socketInstance.socket.on('newFriendRequest', friendRequestData => {
                if (friendRequestData.profileData.userId === auth.user.id) {
                    setFriendRequestCount(friendRequestCount => friendRequestCount + 1);
                }
            });
            return () => socketInstance.socket.removeListener('newFriendRequest', friendRequestListener);
        }

    }, [auth.user, socketInstance.socket, request]);

    // When user accept or reject or cancellation of friend requests
    useEffect(() => {

        if (socketInstance.socket && request) {
            /*
            const acceptFriendRequestListener = socketInstance.socket.on('acceptFriendRequest', friendRequestData => {
                if (friendRequestData.userData.userId === auth.user.id) {
                    setFriendRequestCount(friendRequestCount);
                }
            });
            */
            const rejectFriendRequestListener = socketInstance.socket.on('rejectFriendRequest', friendRequestData => {
                if (friendRequestData.userData.userId === auth.user.id) {
                    setFriendRequestCount(friendRequestCount => friendRequestCount - 1);
                }
            });
            const cancelFriendRequestListener = socketInstance.socket.on('cancelFriendRequest', friendRequestData => {
                if (friendRequestData.profileData.userId === auth.user.id) {
                    setFriendRequestCount(friendRequestCount => friendRequestCount - 1);
                }
            });
            return () => {
                //socketInstance.socket.removeListener('acceptFriendRequest', acceptFriendRequestListener);
                socketInstance.socket.removeListener('rejectFriendRequest', rejectFriendRequestListener);
                socketInstance.socket.removeListener('cancelFriendRequest', cancelFriendRequestListener);
            }
        }

    }, [auth.user, socketInstance.socket, request]);

    const toggleShow = () => {
        setShow(!show);
    }

    return (
        <div>
            <div className='sidebar-section'>
                <h5 className='sidebar-dropdown' onClick={toggleShow}>
                    <i className={'icon fas fa-caret-right ' + (show ? 'open' : null)}></i> {sectionTitle}
                    {
                        request 
                        ? friendRequestCount ? <div className='count-wrapper'>{friendRequestCount}</div> : null
                        : totalUnreads && !show ? <div className='count-wrapper'>{totalUnreads}</div> : null
                    }        
                </h5>
                <div className='sidebar-link-wrapper'>
                    <div style={{ display: show ? 'block' : 'none' }}>
                        {
                            items.length !== 0
                                ? items.map(item =>
                                    <SideBarNav
                                        type={type}
                                        key={type === 'channel' ? item.channelId : item.userId}
                                        item={item}
                                        setTotalUnreads={setTotalUnreads}
                                    />)
                                : <h6 className='sidebar-link'>(No {placeholder} found)</h6>

                        }
                    </div>

                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    auth: state.auth,
    socketInstance: state.socket
});

export default connect(mapStateToProps, null)(SideBarSection);