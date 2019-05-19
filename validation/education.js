const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
  let errors = {};

  // this is done becaue the validator.isEmpty only tests for strings, so 
  // that's why we created our own isEmpty. this will put it as a string so it
  //  can be tested later. 
  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldOfStudy = !isEmpty(data.fieldOfStudy) ? data.fieldOfStudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  console.log("school:  " + typeof data.school)
  console.log("degree:  " + data.degree)
  console.log("fieldOfStudy:  " + data.fieldOfStudy)
  console.log("from:  " + data.from)

  if (validator.isEmpty(data.school)) {
    errors.school = "School field is required"
  }

  if (validator.isEmpty(data.degree)) {
    errors.degree = "Degree field is required"
  }

  if (validator.isEmpty(data.fieldOfStudy)) {
    errors.fieldofStudy = "Field of study is required"
  }

  if (validator.isEmpty(data.from)) {
    errors.from = "From date field is required"
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}