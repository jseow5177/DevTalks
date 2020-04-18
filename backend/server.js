const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const socketio = require('socket.io');

const chatRoute = require('./routes/chat.route');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/dev-talks", chatRoute);

// ---->> DB not set up yet <<---- //
// DB config
const db = require('./config/keys').mongoURI;
// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('MongoDB successfully connected');
}).catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`App is listening at port ${PORT}`);
});

const io = socketio(server);

io.on('connection', (socket) => {
    console.log('I am connected!');

    socket.on('disconnect', () => {
        console.log('I am disconnected :(');
    });
});