const path = require("path");

const express = require("express"); 
const app = express();

// import our MongoURI string, use it to connect to our database using mongoose
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
// bodyParser tells our app what sorts of requests it should respond to.
const bodyParser = require("body-parser");

const passport = require("passport");

const users = require("./routes/api/users");
const tweets = require("./routes/api/tweets");

const User = require("./models/User")

if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

// .connect returns a promise
// if it fails, we want to know about it: catch
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));


// our app will respond to requests from other software e.g. Postman
app.use(bodyParser.urlencoded({ extended: false }));
// we want our application to respond to JSON requests
app.use(bodyParser.json());

// set up middleware for Passport
app.use(passport.initialize());
// setup a configuration file for Passport
require("./config/passport")(passport);

// To put a new route onto this app object, to use to listen for incoming requests:
// app.method we are listening for
app.get("/", (req, res) => {
    res.send("Hello world!");
});

// when we get a request for a route that starts with /api/users,
// we will use whatever function we passed in (as the second argument).
// So we get the users router out of that file (const users =, above)
app.use("/api/users", users);
app.use("/api/tweets", tweets);


// Need to tell the app object that we want it to listen on a given port.
// Define port
// const port = 5000;
// But Heroku might want us to listen on a diff port. 
// So we get port variable out of the environment variables on Heroku.
// If we are in production, use that port variable, if we are not, we use 5000.
const port = process.env.PORT || 5000;

app.listen(port, () => {console.log(`Listening on port ${port}`)});

