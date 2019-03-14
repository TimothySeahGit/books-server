const express = require("express");
const router = express.Router();

const books = [
  { id: "1", title: "the old man and the sea", author: "i dunno", qty: "2" },
  { id: "2", title: "1984", author: "George Orwell", qty: "3" },
  { id: "3", title: "Dune", author: "Frank Herbert", qty: "5" }
];

router
  .route("/")
  .get((req, res) => {
    //respond to requests
    res.status(200);
    res.json(books);
  })
  .post((req, res) => {
    const book = req.body;
    book.id = (books.length + 1).toString();
    books.push(book);
    res.status(201);
    res.json(book);
  });

router
  .route("/:id")
  .delete((req, res) => {
    const bookId = req.params.id;
    const result = books.filter(book => book.id != bookId);
    res.status(202).json(result);
  })
  .delete((req, res) => {
    res.status(202).end();
  });

module.exports = router;
