const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

let db;
MongoClient.connect(process.env.MONGODB_URI, (err, client) => {
  if (err) return console.log(err)
  db = client.db('heroku_nm2nzd77')

  // TODO make promise async
  const getAllScores = (res) => {
    db.collection('data_players')
      .find()
      .toArray((err, results) => {
        console.log(results)
        return res.json(getAllScores())
      })
  }

  const calculateTimeLapse = (time)=>{
    const minToSec = time.minute *60
    return minToSec+ time.second

  }

  app.get('/best-scores', (req, res) => {
    db.collection('data_players')
      .find()
      .sort({score:-1, health:-1})
      .toArray((err, results) => {
        console.log(results)
        return res.json(results)
      })
  });
  app.post('/send-scores', function (req, res) {
    const db = client.db('heroku_nm2nzd77')
    console.log(req.body)
    if (Object.keys(req.body).length) {
      db.collection('data_players')
        .insertOne(req.body, null, function (error, results) {
          if (error) throw error;
          console.log("Le document a bien été inséré", results);
          if (results.result.ok) {
            db.collection('data_players')
              .find()
              .sort({score:-1, health:-1})
              .toArray((err, results) => {
                return res.json(results)
              })
          }
        })
    }
  })
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
  app.listen(process.env.PORT || 8080, () => {
    console.log('listening on ' + process.env.PORT)
  })
})