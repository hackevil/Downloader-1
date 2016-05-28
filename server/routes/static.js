'use strict';

const express = require('express');
const router = express.Router(); //eslint-disable-line
const directory = `${__dirname}/../../`;

router.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: `${directory}/client/`,
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    },
  }, (error) => {
    if (error) {
      res.status(error.status).end();
    }
  });
});

router.use('/public', express.static(`${directory}/dist`));
router.use('/downloads', express.static(`${directory}/downloads`));

module.exports = router;
