const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
  let errors = {};

  // Need to make a string for validator to understand not just null or undefined.
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  // Checks to see if the email is not a valid email.
  if (!Validator.isEmail(data.email)) {
    errors.email = 'Not a valid Email';
  }
  // Checks to see if no password was given.
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password is required';
  }

  // Checks to see if the no email was given.
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email is required';
  }

  console.log(errors);

  return {
    errors,
    isValid: isEmpty(errors)
  };
};