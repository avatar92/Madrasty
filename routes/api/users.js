const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();

const Users = require("../../model/Users");
const Schools = require("../../model/Schools");

const keys = require("../../config/keys");

const validateRegisterInput = require("../../validator/register");
const validateLoginInput = require("../../validator/login");

// GET /api/user/test
// desc Test user route
// access public

router.get("/test", (req, res) => {
  res.json({ msg: "hello user" });
});

// POST /api/user/register/superAdmin
// desc Register a user
// access public

router.post("/register/superAdmin", (req, res) => {
  //checking for validation
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  Users.findOne({ role: "superAdmin" }).then(user => {
    if (user) {
      errors.username = "You can only have one super Admin";
      return res.status(400).json(errors);
    } else {
      const superAdmin = new Users({
        username: req.body.username,
        password: req.body.password,
        avatar: req.body.avatar,
        role: "superAdmin"
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(superAdmin.password, salt, (err, hash) => {
          if (err) throw err;
          superAdmin.password = hash;
          superAdmin
            .save()
            .then(user => res.status(200).json(user))
            .catch(e => console.log(e));
        });
      });
    }
  });
});

// POST /api/user/register/adminandschool
// desc Register a user
// access private

router.post(
  "/register/adminandschool",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //checking for validation
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    if (req.user.role !== "superAdmin") {
      errors.unauthorized = "you are not authorized";
      return res.status(401).json(errors);
    }
    Users.findOne({ username: req.body.username })
      .then(user => {
        if (user) {
          errors.username = "This username already exist";
          return res.status(400).json(errors);
        } else {
          const newUser = new Users({
            username: req.body.username,
            password: req.body.password,
            avatar: req.body.avatar,
            role: "admin"
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => console.log(user))
                .catch(e => console.log(e));
            });
          });
          return newUser;
        }
      })
      .then(user => {
        const newSchool = new Schools({
          name: req.body.name,
          admin: user._id
        });
        newSchool
          .save()
          .then(school => res.status(200).json({ user, school }))
          .catch(e => res.json(e));
      })
      .catch(e => res.json(e));
  }
);

// POST /api/user/login
// desc Login a user
// access public

router.post("/login", (req, res) => {
  const userLogin = {
    username: req.body.username,
    password: req.body.password
  };
  Users.findOne({ username: userLogin.username }).then(user => {
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    if (!user) {
      errors.username = "username not found";
      return res.status(404).json(errors);
    }
    //check password
    bcrypt
      .compare(userLogin.password, user.password)
      .then(isMatch => {
        if (isMatch) {
          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          };
          //sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 10000 },
            (err, token) => {
              res.json({ success: true, token: "bearer " + token });
            }
          );
        } else {
          errors.password = "password is incorrect";
          return res.status(400).json(errors);
        }
      })
      .catch(e => res.status(400).json(e));
  });
});
// GET /api/user/allusersandschools
// desc get all user and school
// access private
router.get(
  "/allusersandschools",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let errors;
    if (req.user.role !== "superAdmin") {
      errors.unauthorized = "not authorized";
      return res.status(401).json(errors);
    }
    Schools.find()
      .populate("admin", ["username", "avatar", "role"])
      .exec()
      .then(schools => res.status(200).json(schools))
      .catch(e => res.json(e));
  }
);

// GET /api/user/current
// desc get current user
// access private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json({
      id: req.user.id,
      username: req.user.username,
      avatar: req.user.avatar,
      role: req.user.role
    });
  }
);

// PUT /api/users/adminandschool
// desc update the admin and the user
// access private


// DELETE /api/users/:admin_id
// DELETE update the admin and the user
// access private

module.exports = router;
