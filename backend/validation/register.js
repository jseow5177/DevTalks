const Validator = require('validator');
const isEmpty = require('is-empty');

const validateRegisterInput = data => {

    const errors = {};

    // Validator functions require string inputs
    // Need to convert empty field to strings
    data.username = isEmpty(data.username) ? '' : data.username;
    data.email = isEmpty(data.email) ? '' : data.email;
    data.password = isEmpty(data.password) ? '' : data.password;
    data.confirmPassword = isEmpty(data.confirmPassword) ? '' : data.confirmPassword;

    // Check if username is empty
    if (Validator.isEmpty(data.username)) {
        errors.username = 'Name field is required';
    };

    // Check if email is empty
    // If not empty, check if email is valid
    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    } else if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    };

    // Check if password is empty
    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    };

    // Check if confirmPassword is empty
    if (Validator.isEmpty(data.confirmPassword)) {
        errors.confirmPassword = 'Confirm password field is required';
    };

    // Check if password is at least 6 characters long
    if (!Validator.isLength(data.password, {min: 6})) {
        errors.password = 'Password must be at least 6 characters';
    };

    // Check if password equals to confirmPassword
    if (!Validator.equals(data.password, data.confirmPassword)) {
        errors.confirmPassword = 'Passwords must match';
    };

    return {
        errors,
        isValid: isEmpty(errors)
    };

};

module.exports = validateRegisterInput;