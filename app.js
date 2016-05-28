'use strict'; // eslint-disable-line

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const apiRoutes = require('./server/routes/api');
const staticRoutes = require('./server/routes/static');

const port = process.env.PORT || 8080;
const apiEndpoint = process.env.API_ROOT_PATH || '/api/v1/downloads';

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

app.use('/', staticRoutes);
app.use(apiEndpoint, apiRoutes);

app.listen(port);

console.log(`Server started on ${port}`);
