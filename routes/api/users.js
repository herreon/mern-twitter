const express = require("express");

// get a router object off of the Router
const router = express.Router();

const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const keys = require("../../config/keys");
const jwt = require("jsonwebtoken");

const passport = require('passport')

// import validations
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// add routes onto the router instance
// res.json() sends back a json string that looks a lot like the object we pass into it
router.get("/test", (req, res) => res.json({ msg: "This is the users route" }));

// private auth route -- testing with postman -- changed get to post -- why wouldnt get work?
// router.post('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
//   res.json({ msg: 'Success' });
// })

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    handle: req.user.handle,
    email: req.user.email
  });
})

router.post("/register", (req, res) => {

  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  // check if user already exists based on email
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      // Use the validations to send the error
      errors.email = "A user is already registered with this email";
      return res.status(400).json(errors);
    } else {
        const newUser = new User({
            handle: req.body.handle,
            email: req.body.email,
            password: req.body.password 
        });
  
  // just for testing
  // newUser.save().then(user => res.send(user)).catch(err => res.send(err));

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                  .then(user => res.json(user))
                  .catch(err => console.log(err));
          });
        });
    }
  })
});


// login route - basic one that checks if passport is correct.
// No persistent session / anything to change what happens to future requests.

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      // Use the validations to send the error
      errors.email = "This user does not exist.";
      return res.status(404).json(errors);
    }

    // bcrypt.compare checks if hashing this password gives us the same result as the other user.password.
    // returns a promise
    bcrypt.compare(password, user.password)
      .then(isMatch => {
        if (isMatch) {
          // res.json({ msg: "Success" });
          const payload = {
            id: user.id, // comes from mongoDB
            handle: user.handle,
            email: user.email
          }

          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 }, // optiosn hash; we want the jwt to expire in 3600s, or 1 hour

            // callback fn for once we have created this jwt
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          )

        } else {
    
          errors.password = "Incorrect password";
          return res.status(400).json(errors);
        }
    });
  });
});

module.exports = router;
