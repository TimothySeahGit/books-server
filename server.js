const app = require("./app");
const mongoose = require("mongoose");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const port = process.env.PORT;
const mongodbUri = process.env.MONGODB_URI;

mongoose.connect(mongodbUri, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false
});

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
