const express = require("express");
const app = express();
const books = require("./routes/books");

app.use(express.static("public"));
app.use(express.json());
app.use("/api/v1/books", books);

module.exports = app;
