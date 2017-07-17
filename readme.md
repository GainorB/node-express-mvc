# MVC Design Patern
### for Node.js using Express.js and PostgreSQL database

MVC is a software architecture that separates application logic from the rest of the user interface. It does this by separating the application into three parts: the model, the view, and the controller.

**The model** manages fundamental behaviors and data of the application. To name a few, it can respond to requests for information, or respond to instructions to change the state of its information. This could be a database, or any number of data structures or storage systems. In short, it is the data and data-management of the application.

**The view** effectively provides the user interface element of the application. It'll render data from the model into a form that is suitable for the user interface.

**The controller** receives user input and makes calls to model objects and the view to perform appropriate actions.

1. **npm init** to generate a package.json
2. Create folder structure 

![MVC Folder Structure](./readme-assets/mvc.png)

3. Create **server.js** (entry point)
4. Create .gitignore (optional)
5. Create .env (optional)
6. **npm install** node modules, **--save flag**
    * npm install **express**
    * npm install **ejs**
    * npm install **body-parser**
    * npm install **bluebird**
    * npm install **pg-promise**
    * npm install **dotenv**
    * npm install **cors**
    * npm install **nodemon --save-dev**
    * npm install **morgan --save-dev**
7. Edit scripts in **package.json**
    * "npm start": "nodemon server"

    
### server.js
Entry point: the main file that is ran to start the server

```javascript
// SUPPORT .ENV FILES
require('dotenv').config();
const cors = require('cors');
const express = require('express'); // BRING IN EXPRESS
const app = express(); // INITILIZE APP
const path = require('path');
const bodyParser = require('body-parser'); 

// CORE MODULE, USED TO CREATE THE HTTP SERVER
const http = require('http');
// CREATE HTTP SERVER USING APP
const server = http.createServer(app);
// INITIALIZE DEFAULT PORT OR PORT FROM ENVIRONMENT VARIABLE
const port = process.env.PORT || '3000';
// TERMINAL LOGGER: SHOWS THE ROUTE AND STATUS CODE FOR EVERY REQUEST
const logger = require('morgan');

// VIEW ENGINE SETUP
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// USE MORGAN
app.use(logger('dev'));
// PARSE application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // PARSE application/json

// USE STATIC FILES (CSS, JS, IMAGES)
app.use(express.static(path.join(__dirname, 'public')));

// CORS
app.all('/*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// CONTROLLERS
app.use('/', require('./controllers/indexController'));

/*
* START SERVER
*/

// SET THE PORT
app.set('port', port);

// LISTEN ON SPECIFIED PORT
server.listen(port);

// LOG WHICH PORT THE SERVER IS RUNNING ON
console.log('Server listening on port ' + port);

// CATCH 404 AND FORWARD TO ERROR HANDLER
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// ERROR HANDLER
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

// EXPORT APP
module.exports = app;
```

### config/config.js
Database configuration

```javascript
// PROMISE LIBRARY
const promise = require('bluebird');

// OVERRIDING DEFAULT PROMISE LIBRARY
const options = { promiseLib: promise };
const pgp = require('pg-promise')(options);

// SET UP THE CONNECTION STRING FOR THE DATABASE
const connectionString = process.env.DATABASE_URL;
const db = pgp(connectionString);

module.exports = db;
```

### controllers/indexController.js
Controller imports a model and then processes the returned data to render a view.

```javascript
const express = require('express');
const router = express.Router();

// REQUIRE MODEL
const index = require('../models/index.js');

// GET ALL ARTICLES
router.get('/', (req, res, next) => {
    index.getAllArticles()
        //.then(data => console.log(data))
        //.then(data => res.render('index', { data }))
        .then(data => res.json({ title: 'Retreived all Articles', success: true, data }))
        .catch(err => res.json({ err }));
});

// CREATE ARTICLE
router.post('/newArticle', (req, res, next) => {
    const { title, content } = req.body;
    index.createArticle(title, content)
        .then(res.json({ success: true, msg: 'Article Created' }))
        .catch(err => res.json({ err }));
});

// UPDATE ARTICLE
router.put('/updateArticle/:id', (req, res, next) => {
    const { title, content } = req.body;
    let id = req.params.id;

    index.updateArticle(req.body.title, req.body.content, id)
        .then(res.json({ success: true, msg: 'Article Updated' }))
        .catch(err => res.json({ err }));
});

// DELETE ARTICLE
router.delete('/deleteArticle/:id', (req, res, next) => {
    let id = req.params.id;

    index.deleteArticle(id)
        .then(res.json({ success: true, msg: 'Article Deleted' }))
        .catch(err => res.json({ err }));
});

module.exports = router;
```

### models/index.js
Model handles any interaction with the database, then exports the data to the controller to render a view.

```javascript
// REQUIRE CONFIG FILE TO INTERACT WITH DATABASE
const db = require('../config/config');

// CREATE ARTICLE
function createArticle(title, content){
    return db.none(`INSERT into articles(title, content)`
                    + `VALUES($1, $2)`, [title, content]);
}

// READ (GET) ARTICLES
function getAllArticles(){
    return db.any('SELECT * FROM articles');
}

// UPDATE
function updateArticle(title, content, articleID){
    return db.none(`UPDATE articles SET title = $1, content = $2 WHERE id = $3`, [title, content, articleID]);
}

// DELETE
function deleteArticle(articleID){
    return db.none(`DELETE from articles WHERE id = $1`, articleID);
}

module.exports = {
    createArticle, // CREATE
    getAllArticles, // READ
    updateArticle, // UPDATE
    deleteArticle // DELETE
}
```

### Documentation
1. pg-promise: https://github.com/vitaly-t/pg-promise
2. body-parser: https://github.com/expressjs/body-parser
3. cors: https://github.com/expressjs/cors