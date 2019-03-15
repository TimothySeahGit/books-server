const app = require("./app");

const port = process.env.PORT;

app.listen(port, () => {
  if (process.env.NODE_ENV === "production") {
    console.log(`Server is running on HEROKU withp port number ${port}`);
  } else {
    console.log(`server is running on http://localhost:${port}`);
  }
});
