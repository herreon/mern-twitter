// tell passport that we want to use the Strategy for handling json webtokens
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require("./keys");

const options = {};
// where we are going to get our json webtoken from
// fromAuthHeaderAsBearerToken method extracts the jsonwebtoken(bearer token) from the header
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// tell passport that we want our secretOrKey, so that it knows what to 
// check against, when checking if things are signed
options.secretOrKey = keys.secretOrKey;

// set up as anonymous function (from video)
// module.exports = passport => {
//     passport.use(new JwtStrategy(options, (jwt_payload, done) => {
//         console.log(jwt_payload);
//         done();
//     }))
// }

// (from notes)
module.exports = passport => {
    passport.use(new JwtStrategy(options, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
            .then(user => {
                if (user) {
                    // return the user to the frontend
                    return done(null, user);
                }
                // return false since there is no user
                return done(null, false);
            })
            .catch(err => console.log(err));
    }));
};
// jwt_payload includes the items that we have specified
// done - keyword, same as next, but extra functionality:
// we will pass things to it, and thsoe things will be passed up to our front end.

// Use it so that, when we create our route and ask passport to authenticate our user,
// passport doesn't hang / not tell app that it is finished with our controller
// and to pass it on to the next thing.

// next() - middleware keyword:
// this middleware fn has finished running; pls hand off control
// to next middleware in line for our controller