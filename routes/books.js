const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const Book = require("../models/book");
const secret = "SUPER SECRET";

const books = [
  { id: "1", title: "the old man and the sea", author: "i dunno", qty: "2" },
  { id: "2", title: "1984", author: "George Orwell", qty: "3" },
  { id: "3", title: "Dune", author: "Frank Herbert", qty: "5" }
];

const verifyMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  console.log("error0");
  if (!authorization) {
    console.log("error1");
    return res.sendStatus(403);
  }
  try {
    const token = req.headers.authorization.split("Bearer ")[1];
    const userData = await jwt.verify(token, secret);
    console.log(userData);

    if (!userData) return res.sendStatus(403);
    console.log("error3");
    const user = await User.findOne({ username: userData.username });
    console.log(user);
    if (!user) return res.sendStatus(403);
    console.log("error4");
    return next();
  } catch {
    return res.sendStatus(403);
  }
};

// let verifyMiddleware = (req, res, next) => {
//   let token = req.headers["authorization"]; // Express headers are auto converted to lowercase
//   if (token.startsWith("Bearer ")) {
//     // Remove Bearer from string
//     token = token.slice(7, token.length);
//   }

//   if (token) {
//     jwt.verify(token, secret, (err, decoded) => {
//       if (err) {
//         return res.json({
//           success: false,
//           message: "Token is not valid"
//         });
//       } else {
//         req.decoded = decoded;
//         next();
//       }
//     });
//   } else {
//     return res.json({
//       success: false,
//       message: "Auth token is not supplied"
//     });
//   }
// };

router
  .route("/")
  .get((req, res) => {
    const { author, title } = req.query;

    const queries = Object.entries(req.query); //creates an array full of arrays containing key-value pairs
    let filteredBooks = books;
    queries.forEach(([key, value]) => {
      filteredBooks = filteredBooks.filter(book =>
        book[key].toLowerCase().includes(value.toLowerCase())
      );
    });

    if (title) {
      return Book.or([{ title }, { author }]).then(book => res.json(book));
    }
    if (author) {
      return Book.find({ author }).then(book => res.json(book));
    }

    Book.find((err, books) => {
      if (err) {
        return res.status(500);
      }
      res.status(200);
      return res.json(books);
    });
    // res.json(filteredBooks);
  })
  .post(verifyMiddleware, (req, res) => {
    // const book = req.body;
    // book.id = (books.length + 1).toString();
    // books.push(book);
    // res.status(201);
    // res.json(book);
    const book = new Book(req.body);
    book.save((err, book) => {
      if (err) {
        return res.status(500).end();
      }
      return res.status(201).json(book);
    });
  });

router
  .route("/:id")
  .put(verifyMiddleware, (req, res) => {
    Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      (err, book) => {
        return res.status(202).json(book);
      }
    );

    // const bookId = req.params.id;
    // const bookReplacement = req.body;
    // const result = books.filter(book => book.id !== bookId);
    // result.push(bookReplacement);
    // res.status(202);
    // res.json(bookReplacement);
  })
  .delete(verifyMiddleware, (req, res) => {
    Book.findByIdAndDelete(req.params.id, (err, book) => {
      if (err) {
        return res.sendStatus(400);
      }
      if (!book) {
        return res.sendStatus(404);
      }
      return res.status(202).json(book);
    });
  });

module.exports = router;
