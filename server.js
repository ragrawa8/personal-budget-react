// Budget API

const express = require("express");
const app = express();
const port = 8000;
const fs = require("fs");
const cors = require("cors");

app.use("/", express.static("public"));

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.get("/budget", (req, res) => {
  fs.readFile("Database.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading the file");
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.listen(port, () => {
  console.log(`API served at http://localhost:${port}`);
});
