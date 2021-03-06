var express = require('express')
var gitHandler = require('./gitHandler.js');
const bddReader = require('./bddReader');
var bodyParser = require('body-parser');

process.on('uncaughtException', function(err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

var app = express()

function logErrors(err, req, res, next) {
  console.error(err.stack)
  next(err)
}

// parse application/json
app.use(bodyParser.json())
app.use(logErrors)

app.post('/clone', function(req, res) {
  gitHandler.clone(req.body.url).then((result) => {
    res.send(result)
  })
})

app.post('/pull', function(req, res) {
  gitHandler.pull().then((result) => {
    res.send(result)
  })
})

app.get('/latestCommit', function(req, res) {
  gitHandler.getLatestCommitInfo().then((result) => {
    res.send(result)
  })
})

app.get('/parse', (req, res) => {
  bddReader.read((result) => {
    res.send(result)
  })
})

app.listen(3005, function() {
  console.log('Example app listening on port 3005!')
})
