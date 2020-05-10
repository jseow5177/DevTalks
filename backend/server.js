const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const http = require("http");

// App routes
const chatRoute = require('./routes/chat.route');
const userRoute = require('./routes/user.route');
const profileRoute = require('./routes/profile.route');

// Connect to MongoDB
const db = require('./config/db');
db.connect();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Establish socket connection
const server = http.createServer(app);
const io = require('socket.io').listen(server);
require('./io')(io);

// Passport middleware
app.use(passport.initialize());
// Passport config for JWT strategy
require('./config/passport')(passport);

app.use('/dev-talks', profileRoute);
app.use('/dev-talks', chatRoute);

app.use('/users', userRoute);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`App is listening at port ${PORT}`);
});