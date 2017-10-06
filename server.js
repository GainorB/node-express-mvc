require('dotenv').config(); // SUPPORT .ENV FILES
const express = require('express'); // BRING IN EXPRESS
const app = express(); // INITILIZE APP
const path = require('path');
const bodyParser = require('body-parser');
const articles = require('./routes/articlesRoutes'); // ARTICLES ROUTES

const http = require('http'); // CORE MODULE, USED TO CREATE THE HTTP SERVER
const server = http.createServer(app); // CREATE HTTP SERVER USING APP
const port = process.env.PORT || '3000'; // INITIALIZE DEFAULT PORT OR PORT FROM ENVIRONMENT VARIABLE

const logger = require('morgan'); // TERMINAL LOGGER: SHOWS THE ROUTE AND STATUS CODE FOR EVERY REQUEST

// VIEW ENGINE SETUP
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev')); // USE MORGAN
app.use(bodyParser.urlencoded({ extended: false })); // PARSE application/x-www-form-urlencoded
app.use(bodyParser.json()); // PARSE application/json

// USE STATIC FILES (CSS, JS, IMAGES)
app.use(express.static(path.join(__dirname, 'public')));

// CORS
app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// SECURITY
app.disable('x-powered-by');

// ROUTES
articles(app); // ARTICLES ROUTES

/*
* START SERVER
*/

// SET THE PORT
app.set('port', port);

// LISTEN ON SPECIFIED PORT
server.listen(port);

// LOG WHICH PORT THE SERVER IS RUNNING ON
console.log('Server listening on port ' + port);

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send(err.stack);
});

// EXPORT APP
module.exports = app;
