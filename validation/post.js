const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
  let errors = {};

  // this is done becaue the validator.isEmpty only tests for strings, so 
  // that's why we created our own isEmpty. this will put it as a string so it
  //  can be tested later. 
  data.text = !isEmpty(data.text) ? data.text : '';
  console.log("text");
  console.log(data.text);

  if(!validator.isLength(data.text, {min: 10, max: 300})) {
    errors.text = "Text field must be between 10 and 300 characters"
  }

  if (validator.isEmpty(data.text)) {
    errors.text = "Text field is required"
  }


  return {
    errors,
    isValid: isEmpty(errors)
  }
}