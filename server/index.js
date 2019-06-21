var express = require("express");
var cors = require("cors");
var app = express();

app.use(
  cors({
    origin: "*"
  })
);

app.post("/api/authentication", function(req, res) {
  res.send({ token: Date.now() });
});

app.get("/", function(req, res) {
  res.send();
});

app.listen(3001);
