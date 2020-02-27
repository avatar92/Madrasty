const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateLoginInput(data) {
  let errors;
  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  //checking for username
  if (isEmpty(data.username)) {
    errors.username = "User name Field is required";
  }
  //checking for password
  if (isEmpty(data.password)) {
    errors.password = "Password Field is Required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
