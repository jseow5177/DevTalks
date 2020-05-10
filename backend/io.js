module.exports = (io) => {

    io.on('connection', socket => {
        console.log('I am connected!');
        
        // When app is loaded, add user's socket into all his or her channels
        socket.on('joinChannel', joinedChannels => {
            joinedChannels.forEach(joinedChannel => {
                socket.join(joinedChannel.channelId);
            });
        });

        // When app is loaded, add user's socket into all his or her conversations
        socket.on('joinConversation', joinedConversations => {
            joinedConversations.forEach(joinedConversation => {
                socket.join(joinedConversation);
            });
        });

        socket.on('joinNewConversation', newConversation => {
            socket.join(newConversation);
        });
    
        // Receive new message and emit to all clients in the channel or conversation
        socket.on('sendMessage', data => {
            io.to(data.id).emit('message', data);
            
        });

        socket.on('notification', data => {
            socket.broadcast.to(data.id).emit('notification', data);
        });
    
        // When a user joins a channel:
        // 1. Add him or her into the channel
        // 2. Perform live update on the body (eg: Update SideBar, update number of participants on ChannelInfo)
        // 3. Emit an admin message that says a new user has joined
        socket.on('newMember', data => {
            socket.join(data.id);
            io.to(data.id).emit('newMember', data.id);
            io.to(data.id).emit('message', data);
        });

        // When a user joins a channel:
        // 1. Perform live update on the body (eg: Update SideBar, update number of participants on ChannelInfo)
        // 2. Emit an admin message that says a new user has joined
        socket.on('userLeft', data => {
            io.to(data.id).emit('userLeft', data.id);
            io.to(data.id).emit('message', data);
        });
        
        // Show <username> is typing...
        socket.on('isTyping', data => {
            socket.broadcast.to(data.id).emit('isTyping', data);
        });

        socket.on('newFriendRequest', friendRequestData => {
            io.emit('newFriendRequest', friendRequestData);
        });

        socket.on('acceptFriendRequest', data => {
            io.emit('acceptFriendRequest', data.friendRequestData);
            io.emit('joinNewConversation', data);
        });

        socket.on('cancelFriendRequest', friendRequestData => {
            io.emit('cancelFriendRequest', friendRequestData);
        });

        socket.on('rejectFriendRequest', friendRequestData => {
            io.emit('rejectFriendRequest', friendRequestData);
        });

        socket.on('unfriend', friendRequestData => {
            io.emit('unfriend', friendRequestData);
        });
    
        socket.on('disconnect', () => {
            console.log('I am disconnected :(');
        });
    });

}



