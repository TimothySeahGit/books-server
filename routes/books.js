const express = require("express");
const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    //respond to requests
    res.json(students);
  })
  .post((req, res) => {
    const student = req.body;
    student.id = "123";
    res.status(201);
    res.json(student);
  });
