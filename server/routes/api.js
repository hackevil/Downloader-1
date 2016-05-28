'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line
const downloader = require('../downloader');
const debug = (value) => console.log(value);

router.post('/', (req, res) => {
  const fileUrl = req.body.data.url;
  debug('Request to download:', fileUrl);
  if (fileUrl === undefined || fileUrl === '') {
    debug('Failed. No file specified');
    res.sendStatus(500);
  } else {
    downloader.download(fileUrl);
  }
});

router.get('/', (req, res) => {
  downloader.getDownloadList()
    .then(files => res.json(files))
    .catch(error => debug(error));
});

router.delete('/', (req, res) => {
  debug('Remove All');
  downloader.removeAllCompleted(() => {
    res.send('Removed All');
  });
});

router.delete('/:id', (req, res) => {
  const docId = req.params.id;
  debug('Remove: ', docId);
  if (docId) {
    downloader.removeCompleted(docId, () => {
      res.send(`Removed: ${docId}`);
    });
  } else {
    res.status(404).send('Error 404: No quote found');
  }
});

module.exports = router;
