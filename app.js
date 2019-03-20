const express = require("express");
const app = express();
const books = require("./routes/books");
const index = require("./index");

app.use(express.static("public"));
app.use(express.json());
app.use("/api/v1/books", books);
app.use("/", index);

module.exports = app;
