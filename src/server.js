require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.use("/users", require("./controller/users/router/router"));
app.use("/books", require("./controller/books/router/router"));
app.use("/authors", require("./controller/authors/router/router"));
app.all("/*", (req, res) => {
  res.status(500).json({
    status: 500,
    message: "Route not found",
  });
});
app.listen(PORT, (err) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log(`server running on port ${PORT}`);
});
