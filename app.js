const express = require("express"); 
const app = express();
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

// To put a new route onto this app object, to use to listen for incoming requests:
// app.method we are listening for
app.get("/", (req, res) => {
    res.send("Hello hworld!");
});

// Need to tell the app object that we want it to listen on a given port.
// Define port
// const port = 5000;
// But Heroku might want us to listen on a diff port. 
// So we get port variable out of the environment variables on Heroku.
// If we are in production, use that port variable, if we are not, we use 5000.
const port = process.env.PORT || 5000;

app.listen(port, () => {console.log(`Listening on port ${port}`)});