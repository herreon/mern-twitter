const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId, // type is user's objectid
        ref: 'users' // name of the model we want to associate tweet with
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Tweet = mongoose.model('tweet', TweetSchema);
// now we have a mongoose model, so we export
module.exports = Tweet;