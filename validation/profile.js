const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileinInput(data) {
  let errors = {};

  // this is done becaue the validator.isEmpty only tests for strings, so 
  // that's why we created our own isEmpty. this will put it as a string so it
  //  can be tested later. 
  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';

  if (!validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Handle needs to be between 2 and 40 characters"
  }

  if (validator.isEmpty(data.handle)) {
    errors.handle = "Profile Handle is required"
  }

  if (validator.isEmpty(data.status)) {
    errors.status = "Status field is required"
  }

  if (validator.isEmpty(data.skills)) {
    errors.skills = "Skills field is required"
  }

  // check first that it is not empty (because it can be blank) if it
  // isnt' blank then check if it's a valid URL
  if (!isEmpty(data.website)) {
    if (!validator.isURL(data.website)) {
      errors.website = "Not a Valid URL"
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!validator.isURL(data.youtube)) {
      errors.youtube = "Not a Valid URL"
    }
  }

  if (!isEmpty(data.twitter)) {
    if (!validator.isURL(data.twitter)) {
      errors.twitter = "Not a Valid URL"
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!validator.isURL(data.facebook)) {
      errors.facebook = "Not a Valid URL"
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!validator.isURL(data.linkedin)) {
      errors.linkedin = "Not a Valid URL"
    }
  }

  if (!isEmpty(data.instagram)) {
    if (!validator.isURL(data.instagram)) {
      errors.instagram = "Not a Valid URL"
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}