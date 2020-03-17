const Validator = require("validator");
const validText = require("./valid-text");

// create named function
module.exports = function validateRegisterInput(data) {
    let errors = {};

    // grab all of the fields of our data object (the argument), 
    // or, if they are not there, we will add them to our object

    data.handle = validText(data.handle) ? data.handle : "";
    // returns a boolean value. if it is validtext already, we return that
    data.email = validText(data.email) ? data.email : "";
    data.password = validText(data.password) ? data.password : "";
    data.password2 = validText(data.password2) ? data.password2 : "";
    // confirm that the user entered the pw they wanted to

    if (!Validator.isLength(data.handle, { min: 2, max: 30 })) {
        errors.handle = "Handle must be between 2 and 30 characters";
    }

    if (Validator.isEmpty(data.handle)) {
        errors.handle = "Handle field is required";
    }

    if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
    }
     
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    }

    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be between 6 and 30 characters";
    }

    if (Validator.isEmpty(data.password)) {
      errors.password = "Password field is required";
    }

    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match";
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    }

}