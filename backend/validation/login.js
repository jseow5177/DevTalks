const Validator = require('validator');
const isEmpty = require('is-empty');

const validateLoginInput = data => {

    const errors = {};

    // Validator functions require string inputs
    // Need to convert empty field to strings
    data.email = isEmpty(data.email) ? '' : data.email;
    data.password = isEmpty(data.password) ? '' : data.password;

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

    return {
        errors,
        isValid: isEmpty(errors)
    };

};

module.exports = validateLoginInput;