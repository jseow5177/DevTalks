// Setup passport-jwt authentication strategy

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/User');
const keys = require('./keys');

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // Extract token from auth header
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    // Set up passport strategy
    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            // Take user id from jwt_payload
            const foundUser = User.findById(jwt_payload.id);
            if (foundUser) {
                return done(null, foundUser);
            } else {
                return done(null, false);
            }
        } catch(err) {
            console.log(err);
        }
    })
)};