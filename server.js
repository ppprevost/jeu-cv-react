const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "build")));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.listen(process.env.PORT || 8080, () => {
  console.log("listening on " + process.env.PORT);
});

app.post("/send-scores", function(req, res) {
  res.json([{_id:0,...req.body}]);
});
