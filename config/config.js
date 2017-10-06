// PROMISE LIBRARY
const promise = require('bluebird');

// OVERRIDING DEFAULT PROMISE LIBRARY
// WHENEVER THERE IS A DATABASE INTERACTION WITH A ROUTE, THE DB QUERY WILL CONSOLE LOG
const options = {
  promiseLib: promise,
  query: e => {
    console.log(e.query);
  }
};
const pgp = require('pg-promise')(options);

// SET UP THE CONNECTION STRING FOR THE DATABASE
const connectionString = process.env.DATABASE_URL;
const db = pgp(connectionString);

module.exports = db;
