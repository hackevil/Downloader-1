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

const END_POINT = '/api/v1/downloads';

app.post(END_POINT, function(req, res) {
  var fileUrl = req.body.inputFile;
  console.log("Request to download:", fileUrl);
  if (fileUrl === undefined || fileUrl === "") {
    console.log("Failed. No file specified");
  } else {
    downloader.download(fileUrl);
  }
  res.redirect("/");
});

app.get(END_POINT, function(req, res) {
  res.json(downloader.files);
});

app.delete(END_POINT, function(req, res) {
  console.log("Remove All");
});

app.delete(END_POINT + '/:id', function(req, res) {
  console.log("Remove: ", req.params.id);
  if (req.params.id < 0) {
    res.statusCode = 404;
    return res.send('Error 404: No quote found');
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

app.use('/downloads', express.static(__dirname + '/downloads'));

var port = process.env.PORT || 8080;

app.listen(port);

console.log('Server started on ' + port);
