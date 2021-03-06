const mongoose = require('mongoose');

const dbURI = require('./keys').mongoURI;

module.exports = {
    connect: () => {
        mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(() => {
            console.log('MongoDB successfully connected');
        }).catch(err => console.log(err));
    }
}