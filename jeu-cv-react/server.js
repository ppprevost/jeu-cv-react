const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient
app.use(express.static(path.join(__dirname, 'build')));
MongoClient.connect(process.env.MONGODB_URI, (err, client) => {
  if (err) return console.log(err)
  app.get('/best-scores', function (req, res) {
    const db = client.db('heroku_nm2nzd77')
    db.collection('data_players').find().toArray((err, results) => {
      console.log(results)
      return res.json(results);
    })
  });
  app.get('/send-scores', function (req, res) {
    const db = client.db('heroku_nm2nzd77')
    db.collection('data_players')
      .find()
      .toArray((err, results) => {
      console.log(results)
      return res.json(results);
    })
  });
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
  app.listen(process.env.PORT || 8080, () => {
    console.log('listening on ' + process.env.PORT)
  })
})