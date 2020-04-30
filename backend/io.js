module.exports = (io) => {

    io.on('connection', (socket) => {
        console.log('I am connected!');
        
        // When app is loaded, add user's socket into all his or her channels
        socket.on('joinChannel', (joinnedChannels) => {
            joinnedChannels.forEach(joinnedChannel => {
                socket.join(joinnedChannel.channelId);
            });
        });
    
        // Receive new message and emit to all clients in the channel
        socket.on('sendMessage', (data) => {
            io.to(data.channelId).emit('message', data);
        });
    
        // When a user joins a channel:
        // 1. Add him or her into the channel
        // 2. Perform live update on the body (eg: Update SideBar, update number of participants on ChannelInfo)
        // 3. Emit an admin message that says a new user has joined
        socket.on('newMember', data => {
            socket.join(data.channelId);
            io.to(data.channelId).emit('updateBody', data.channelId);
            io.to(data.channelId).emit('message', data);
        });

        socket.on('userLeft', data => {
            io.to(data.channelId).emit('updateBody', data.channelId);
            io.to(data.channelId).emit('message', data);
        });
        
        // Show <username> is typing...
        socket.on('isTyping', data => {
            socket.broadcast.to(data.channelId).emit('isTyping', data);
        });
    
        socket.on('disconnect', () => {
            console.log('I am disconnected :(');
        });
    });

}



