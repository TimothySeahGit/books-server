const express = require("express");
const router = express.Router();

const books = [
  { id: "1", title: "the old man and the sea", author: "i dunno", qty: "2" },
  { id: "2", title: "1984", author: "George Orwell", qty: "3" },
  { id: "3", title: "Dune", author: "Frank Herbert", qty: "5" }
];

const verifyToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.sendStatus(403);
  } else {
    if (authorization === "Bearer my-awesome-token") {
      next();
    } else {
      res.sendStatus(403);
    }
  }
};

router
  .route("/")
  .get((req, res) => {
    const queries = Object.entries(req.query); //creates an array full of arrays containing key-value pairs
    let filteredBooks = books;
    queries.forEach(([key, value]) => {
      filteredBooks = filteredBooks.filter(book =>
        book[key].toLowerCase().includes(value.toLowerCase())
      );
    });

    res.status(200);
    res.json(filteredBooks);
  })
  .post(verifyToken, (req, res) => {
    const book = req.body;
    book.id = (books.length + 1).toString();
    books.push(book);
    res.status(201);
    res.json(book);
  });

router
  .route("/:id")
  .put(verifyToken, (req, res) => {
    const bookId = req.params.id;
    const bookReplacement = req.body;
    const result = books.filter(book => book.id !== bookId);
    result.push(bookReplacement);
    res.status(202);
    res.json(bookReplacement);
  })
  .delete(verifyToken, (req, res) => {
    const bookId = req.params.id;
    const result = books.filter(book => book.id !== bookId);
    books = result;
    res.status(202).json(result);
  });

module.exports = router;
