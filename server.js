const app = require("./app");

const port = 8082;

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
