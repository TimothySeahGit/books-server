const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const bcrypt = require("bcrypt");

router.route("/").get((req, res) => {
  res.sendStatus(202);
});

const secret = "SUPER SECRET";

router
  .route("/token")
  .get(async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        throw new Error("invalid username or password");
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new Error("invalid username or password");
      }
      const exp = { expiresIn: 14440 };
      const token = await jwt.sign({ username: username }, secret, exp);
      // res.cookie("cookie-monster", token);
      return res.status(200).json({ token });
      //   return res.status(200).end("you are logged in");
    } catch (err) {
      res.status(400).send(err.message);
    }
  })
  .post(async (req, res) => {
    if (!req.headers.authorization) {
      res.sendStatus(401);
    }

    const token = req.headers.authorization.split("Bearer ")[1];
    const userData = await jwt.verify(token, secret);

    return res.status(200).json(userData);
  });

router.route("/register").post(async (req, res) => {
  try {
    const userName = new User(req.body);
    await User.init();
    await userName.save();
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json(err);
  }
});
router.route("/login").post(async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("invalid username or password");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error("invalid username or password");
    }
    const exp = { expiresIn: 14440 };
    const token = await jwt.sign(user, secret, exp);
    // res.cookie("cookie-monster", token);

    return res.status(200).end("you are logged in");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
