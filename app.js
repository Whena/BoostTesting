require('dotenv').config();
const express = require('express');
const expressValidator = require('express-validator');
const path = require('path');
const bodyParser = require('body-parser');
const enrouten = require('express-enrouten');

const isAuthorized = require('./middleware/auth');
const requestId = require('./libs/requestId');

const app = express();
const PORT = process.env.PORT || 3000;

global.serviceName = process.env.SERCVICE_NAME;

app.use(expressValidator());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(requestId);
app.use(isAuthorized);
app.use(enrouten({
  directory: path.join(__dirname, 'controllers'),
}));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`> Server listen to port ${PORT}`);
});
