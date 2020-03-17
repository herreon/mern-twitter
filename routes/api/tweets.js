const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require("passport");

const Tweet = require("../../models/Tweet")
const validateTweetInput = require("../../validation/tweets");

router.get("/test", (req, res) => res.json({ msg: "This is the tweets route" }));


// route: get back index of all tweets
// no need passport.authenticate, because it doesn't matter which user 
// we're logging in with, for this particular route.
router.get("/", (req, res) => {
    Tweet
        .find() // filter by nothing, to get everything back
        .sort({ date: -1 }) // sort by date in reverse order, so that newest comes first
        .then(tweets => res.json(tweets))
        .catch(err => res.status(400).json(err))
});


// route: look up all the tweets by a given user
router.get("/user/:user_id", (req, res) => {
    Tweet
        .find({ user: req.params.user_id })
        .then(tweets => res.json(tweets))
        .catch(err => res.status(400).json(err))
});

// route: get to a specific id
router.get("/:id", (req, res) => {
    Tweet
        .findById(req.params.id)
        .then(tweet => res.json(tweet))
        .catch(err => res.status(400).json(err));
});

// route: post a new tweet
// we want to add user to the request, and we want to do that using passport
// the request object will have a user key on it, 
// that will be the current user based on the json web token.
router.post("/", 
    passport.authenticate("jwt", {session: false}),
    (req, res) => {
        const { isValid, errors } = validateTweetInput(req.body);
        
        // validate that tweet has text & is correct length
        if (!isValid) {
            return res.status(400).json(errors)
        }

        const newTweet = new Tweet({
            text: req.body.text,
            user: req.user.id
        });
    
        newTweet
            .save() // returns a promise
            .then(tweet => res.json(tweet)) // send the tweet back to the user
    }
)

module.exports = router;