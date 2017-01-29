var express = require('express')
var gitHandler = require('./gitHandler.js');
const bddReader = require('./bddReader');

process.on('uncaughtException', function(err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

var app = express()

app.get('/clone', function(req, res) {
  gitHandler.clone().then((result) => {
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
  console.log('Example app listening on port 3000!')
})

function logErrors(err, req, res, next) {
  console.error(err.stack)
  next(err)
}
function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({error: 'Something failed!'})
  } else {
    next(err)
  }
}
function errorHandler(err, req, res, next) {
  res.status(500)
  res.render('error', {error: err})
}
app.use(errorHandler)
app.use(logErrors)
app.use(clientErrorHandler)
