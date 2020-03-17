// import the validator, which is from a package called validator
const Validator = require("validator")
const validText = require("./valid-text");

// write function that takes in data object (which contains email and pw given to us when user is trying to log in),
// and make sure that the inputs are valid

module.exports = function(data) {

    let errors = {};
    // make sure that keys for email and pw exist on the data object
    data.email = validText(data.email) ? data.email : '';
    data.password = validText(data.password) ? data.password : '';

    // populate errors object

    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    // return some kind of object we can use later on, to find out what the outcome of this function was

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };

    // isValid is to check if there are no errors. if no. errors is 0, isValid should be true
}