const validator = require("validator");

const isEmpty = require("./isEmpty");

module.exports = function validateRegisterInput(data) {
  let errors = {};
  roles = ["superAdmin", "admin", "professor", "parent"];
  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.role = !isEmpty(data.role) ? data.role : "";
  

  //validation for username
  if (!validator.isLength(data.username, { min: 2, max: 30 })) {
    errors.username = "User name must be between 2 and 30 character";
  }
  if (validator.isEmpty(data.username)) {
    errors.username = "User Name field is required";
  }

  //validation for password
  if (!validator.isLength(data.password, { min: 6 })) {
    errors.password = "Password must be at least 6 character";
  }
  if (validator.isEmpty(data.password)) {
    errors.password = "Password field field is required";
  }

  //validation for role
  if (roles.filter(role => role === data.role).length === 0) {
    errors.role = `role should be either ${roles[0]} or ${roles[1]} or ${roles[2]} or ${roles[3]}`;
  }
  if (validator.isEmpty(data.role)) {
    errors.role = "User Name field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
