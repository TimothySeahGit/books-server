const app = require("./app");

const port = process.env.PORT || 8082;

//connect to db
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/books-db");

var db = mongoose.connection;
db.on("error", () => {
  console.error("unable to connect to database", err);
});

db.on("connected", () => {
  console.log("successfully connected to the database!");
});

db.once("open", () => {
  // we're connected!
  console.log("successfully connected to the database!");
  app.listen(port, () => {
    if (process.env.NODE_ENV === "production") {
      console.log(`Server is running on HEROKU withp port number ${port}`);
    } else {
      console.log(`server is running on http://localhost:${port}`);
    }
  });
});
