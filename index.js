const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.route("/").get((req, res) => {
  res.sendStatus(202);
});

const secret = "SUPER SECRET";

router
  .route("/token")
  .get(async (req, res) => {
    const userData = { _id: 123 };
    const exp = { expiresIn: 14440 };
    const token = await jwt.sign(userData, secret, exp);
    return res.status(200).json({ token });
  })
  .post(async (req, res) => {
    if (!req.headers.authorization) {
      res.sendStatus(401);
    }

    const token = req.headers.authorization.split("Bearer ")[1];
    const userData = await jwt.verify(token, secret);
    return res.status(200).json(userData);
  });

module.exports = router;
