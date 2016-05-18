'use strict'; // eslint-disable-line

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const downloader = require('./progress');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

/*
 * REST Endpoints
 */

const endPoint = '/api/v1/downloads';

app.post(endPoint, (req, res) => {
  const fileUrl = req.body.url;
  console.log('Request to download:', fileUrl);
  if (fileUrl === undefined || fileUrl === '') {
    console.log('Failed. No file specified');
    res.sendStatus(500);
  } else {
    downloader.download(fileUrl);
  }
});

app.get(endPoint, (req, res) => {
  downloader.getDownloadList()
    .then(files => res.json(files))
    .catch(error => console.log(error));
});

app.delete(endPoint, (req, res) => {
  console.log('Remove All');
  downloader.removeAllCompleted(() => {
    res.send('Removed All');
  });
});

app.delete(`${endPoint}/:id`, (req, res) => {
  const docId = req.params.id;
  console.log('Remove: ', docId);
  if (docId < 0) {
    res.status(404).send('Error 404: No quote found');
  } else {
    downloader.removeCompleted(docId, () => {
      res.send('Removed: ', docId);
    });
  }
});

/*
 * HTML Endpoints
 */

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: `${__dirname}/public/`,
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    },
  }, (error) => {
    if (error) {
      console.log(error);
      res.status(error.status).end();
    }
  });
});

app.use('/3rdparty', express.static(`${__dirname}/public/3rdparty`));
app.use('/scripts', express.static(`${__dirname}/public/scripts`));
app.use('/styles', express.static(`${__dirname}/public/styles`));
app.use('/downloads', express.static(`${__dirname}/downloads`));

const port = process.env.PORT || 8080;

app.listen(port);

console.log(`Server started on ${port}`);
