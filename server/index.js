/** this is a fake server  */

var express = require("express");
var cors = require("cors");
var app = express();

app.use(
  cors({
    origin: "*"
  })
);

app.get("/", function(req, res) {
  // just to have start-server-and-test working
  res.send();
});

app.post("/api/authentication", function(req, res) {
  // the most ridiculous authentication...
  res.send({ token: Date.now() });
});

app.listen(3001);
