const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  // Need to make a string for validator to understand not just null or undefined.
  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';


  // Checks to see if the length of the name fits between the parameters given.
  if (!Validator.isLength(data.name, { min: 2, max: 25 })) {
    errors.name = 'Name must be between 2 and 25 letters';
  }
  // Checks to see if no name was given.
  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name is required';
  }
  // Checks to see if the no email was given.
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email is required';
  }
  // Checks to see if the email is not a valid email.
  if (!Validator.isEmail(data.email)) {
    errors.email = 'Not a valid Email';
  }
  // Checks to see if no password was given.
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password is required';
  }
  // Checks to see if the length of the password doesn't fit between the parameters given.
  if (!Validator.isLength(data.password, { min: 6, max: 15 })) {
    errors.password = 'Password must be between 6 and 15 characters';
  }
  // Checks to see if the confirm password field is empty.
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Password must be confirmed to continue';
  } else {
    // Checks to see if password and confirm password are not the same.
    if (!Validator.equals(data.password, data.password2)) {
      errors.password2 = 'Passwords must match each other';
    }
  }
  console.log(errors);

  return {
    errors,
    isValid: isEmpty(errors)
  };
};