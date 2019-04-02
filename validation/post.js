const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
  let errors = {};

  // Need to make a string for validator to understand not just null or undefined.
  data.text = !isEmpty(data.text) ? data.text : '';

  if (!Validator.isLength(data.text, { min: 2, max: 300 })) {
    errors.text = 'Post must be between 2 and 300 characters';
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = 'Text field is required';
  }

  console.log(errors);
  return {
    errors,
    isValid: isEmpty(errors)
  };
};