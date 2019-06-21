/** this is a fake server  */

var express = require("express");
var cors = require("cors");
var app = express();

app.use(express.json());
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
  if (req.body.username === "stefano@conio.com") {
    res.send({ token: Date.now() });
  } else {
    res.status(401);
    res.send({});
  }
});

app.post("/e2e-tests/seed-data", function(req, res) {
  // a fake data seeder
  res.send();
});

app.listen(3001);
