//The schema looks like this:{ id: "1", title: "the old man and the sea", author: "i dunno", qty: "2" }

const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  author: String
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
