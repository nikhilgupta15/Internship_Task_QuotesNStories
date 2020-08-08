const express = require("express");
const router = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("../models/user");
router.use(cors());

var jwtToken = process.env.SECRET_KEY || "random";

router.post("/register", (req, res) => {
  let userData;
  if (req.body.role === "Admin") {
    userData = {
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      accessR: true,
      accessG: true,
    };
  } else {
    userData = {
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      accessR: false,
      accessG: true,
    };
  }

  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          userData.password = hash;
          User.create(userData)
            .then((user) => {
              res.json({ status: user.email + "Registered!" });
            })
            .catch((err) => {
              res.send("error: " + err);
            });
        });
      } else {
        res.json({ error: "User already exists" });
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

router.post("/login", (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          // Passwords match
          const payload = {
            _id: user._id,
            email: user.email,
            role: user.role,
            accessRedButton: user.accessR,
            accessGreenButton: user.accessG,
          };
          let token = jwt.sign(payload, jwtToken, {
            expiresIn: 1440,
          });
          res.send(token);
        } else {
          // Passwords don't match
          res.json({ error: "User does not exist" });
        }
      } else {
        res.json({ error: "User does not exist" });
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

router.post("/permissions", async (req, res) => {
  await User.findById(req.body.userid)
    .then((user) => {
      user.accessR = true;
      user.save();
      res.send("Permission Updated");
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});
router.get("/profile", async (req, res) => {
  const role = req.query.role;
  if (role === "Admin") {
    await User.find({ role: "Customer" })
      .then((user) => {
        res.send(user);
      })
      .catch((err) => res.status(400).json("Error: " + err));
  } else {
    res.send([]);
  }
});

module.exports = router;
