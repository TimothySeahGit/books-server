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
    const query = req.query;

    if (Object.entries(query).length === 0) {
      res.status(200);
      res.json(books);
    } else {
      const { author, title } = req.query;
      const result = books.filter(
        book =>
          (title && book.title === title) || (author && book.author === author)
      );

      res.status(200);
      res.json(result);
    }
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
  .put((req, res) => {
    const bookId = req.params.id;
    const bookReplacement = req.body;
    const result = books.filter(book => book.id !== bookId);
    result.push(bookReplacement);
    res.status(202);
    res.json(bookReplacement);
  })
  .delete((req, res) => {
    const bookId = req.params.id;
    const result = books.filter(book => book.id !== bookId);
    res.status(202).json(result);
  });

module.exports = router;
