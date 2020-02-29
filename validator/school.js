const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateSchoolInput(data) {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : "";

  //validate school name
  if (validator.isEmpty(data.name)) {
    errors.name = "School name Field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
