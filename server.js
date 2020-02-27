const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");

const app = express();

const users = require("./routes/api/users");
const schools = require("./routes/api/schools");

//using body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//passport middleware

const mongouRI = require("./config/keys").mongoURI;

mongoose
  .connect(mongouRI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log("data base connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello world!!");
});
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//passport config
require("./config/passport")(passport);
//use routes
app.use("/api/users", users);
app.use("/api/schools", schools);

app.listen(3000, () => console.log("app is up and running on port 3000"));
