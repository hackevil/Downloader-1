"use strict"

var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  downloader = require('./progress');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

/******************
 | REST Endpoints |
 ******************/

const endPoint = '/api/v1/downloads';

app.post(endPoint, function(req, res) {
  var fileUrl = req.body.url;
  console.log("Request to download:", fileUrl);
  if (fileUrl === undefined || fileUrl === "") {
    console.log("Failed. No file specified");
    res.sendStatus(500);
  } else {
    downloader.download(fileUrl);
  }
});

app.get(endPoint, function(req, res) {
  downloader.getDownloadList()
    .then(files => res.json(files))
    .catch(error => console.log(error));
});

app.delete(endPoint, function(req, res) {
  console.log("Remove All");
  downloader.removeAllCompleted(function() {
    res.send("Removed All");
  });
});

app.delete(endPoint + '/:id', function(req, res) {
  const docId = req.params.id;
  console.log("Remove: ", docId);
  if (docId < 0) {
    res.statusCode = 404;
    return res.send('Error 404: No quote found');
  } else {
    downloader.removeCompleted(docId, function() {
      res.send("Removed: ", docId);
    });
  }
});

/******************
 | HTML Endpoints |
 ******************/

app.get('/', function(req, res) {
  res.sendFile('index.html', {
      root: __dirname + '/public/',
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    },
    function(error) {
      if (error) {
        console.log(error);
        res.status(error.status).end();
      }
    });
});

app.use('/3rdparty', express.static(__dirname + '/public/3rdparty'));
app.use('/scripts', express.static(__dirname + '/public/scripts'));
app.use('/styles', express.static(__dirname + '/public/styles'));
app.use('/downloads', express.static(__dirname + '/downloads'));

var port = process.env.PORT || 8080;

app.listen(port);

console.log('Server started on ' + port);
