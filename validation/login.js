const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
  let errors = {};

  // this is done becaue the validator.isEmpty only tests for strings, so 
  // that's why we created our own isEmpty. this will put it as a string so it
  //  can be tested later. 
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (!validator.isEmail(data.email)) {
    errors.email = "Email is invalid"
  }

  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required"
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "Password field is required"
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}