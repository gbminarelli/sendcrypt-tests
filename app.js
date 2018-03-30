const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer();

let db = [];

app.post('/', upload.array('encrypted'), (req, res) => {
  console.log('Got a POST request');
  // console.log(req.body);
  // console.log(req.file);
  // console.log(req.files);
  db.push(req.files);
  console.log(db);
  res.send(db);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});
app.get('/index.js', (req, res) => {
  res.sendFile(__dirname + '/index.js');
});
app.get('/folder', (req, res) => {
  res.send(db);
});
// app.get('/formDataMulterTest.js', (req, res) => {
//   res.sendFile(__dirname + '/formDataMulterTest.js');
// });

app.listen(1234, () => console.log('App listening on port 1234!'));
