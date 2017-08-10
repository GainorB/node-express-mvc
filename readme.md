# MVC Design Patern (using Node.js with Express.js and a PostgreSQL database)

MVC is a software architecture that separates application logic from the rest of the user interface. It does this by separating the application into three parts: **the model**, **the view**, and **the controller**.

**The model** manages fundamental behaviors and data of the application. To name a few, it can respond to requests for information, or respond to instructions to change the state of its information. This could be a database, or any number of data structures or storage systems. In short, it is the data and data-management of the application.

**The view** effectively provides the user interface element of the application. It'll render data from the model into a form that is suitable for the user interface.

**The controller** receives user input and makes calls to model objects and the view to perform appropriate actions.

1. **npm init** to generate a package.json
2. Create folder structure 

![MVC Folder Structure](./readme-assets/mvc.png)

3. Create **server.js** (entry point)
4. Create **.gitignore**
5. Create **.env**
6. **npm install** node modules, **--save flag**
    * npm install **express**
    * npm install **ejs**
    * npm install **body-parser**
    * npm install **bluebird**
    * npm install **pg-promise**
    * npm install **dotenv**
    * npm install **nodemon --save-dev**
    * npm install **morgan --save-dev**
7. Edit scripts in **package.json**
    * "npm start": "nodemon server"

### ENDPOINTS FOR A SIMPLE CRUD API

Get articles:

`GET /`

Create an article:

`POST /new`

Update an article:

`PUT /update/article/id`

Delete an article:

`DELETE /delete/article/id`


## server.js
Entry point, the main file that is ran to initialize the server

```javascript
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
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
```

## routes/articlesRoutes.js
Route handlers

```javascript
// REQUIRE CONTROLLER
const ArticlesController = require('../controllers/articlesController');

module.exports = (app) => {
    app.get('/', ArticlesController.getArticles);
    app.post('/new', ArticlesController.createArticle);
    app.put('/update/article/:id', ArticlesController.updateArticle);
    app.delete('/delete/article/:id', ArticlesController.deleteArticle);
}
```

## config/config.js
Database configuration

```javascript
// PROMISE LIBRARY
const promise = require('bluebird');

// OVERRIDING DEFAULT PROMISE LIBRARY
const options = { 
    promiseLib: promise,
    query: (e) => {
        console.log(e.query);
    }
 };
const pgp = require('pg-promise')(options);

// SET UP THE CONNECTION STRING FOR THE DATABASE
const connectionString = process.env.DATABASE_URL;
const db = pgp(connectionString);

module.exports = db;
```

## controllers/articlesController.js
Controller imports a model and then processes the returned data to render a view.

```javascript
// REQUIRE MODEL
const Article = require('../models/article.js');

module.exports = {

    // GET ALL ARTICLES
    getArticles(req, res, next){
        Article.get()
            //.then(data => console.log(data))
            //.then(data => res.render('index', { data }))
            .then(data => res.status(200).json({ title: 'Retreived all Articles', success: true, data }))
            .catch(err => res.status(400).json({ err }));
    },

    // CREATE ARTICLE
    createArticle(req, res, next){
        // USE BODY PARSER TO EXTRACT DATA FROM CLIENT
        const { title, content } = req.body;

        Article.create(title, content)
            .then(res.status(201).json({ success: true, msg: 'Article Created' }))
            .catch(err => res.status(400).json({ err }));
    },

    // UPDATE ARTICLE
    updateArticle(req, res, next){
        // USE BODY PARSER TO EXTRACT DATA FROM CLIENT
        const { title, content } = req.body;
        // ID OF ARTICLE TO UPDATE
        let id = req.params.id;

        Article.update(title, content, id)
            .then(res.status(200).json({ success: true, msg: 'Article Updated' }))
            .catch(err => res.status(400).json({ err }));
    },

    // DELETE ARTICLE
    deleteArticle(req, res, next){
        let id = req.params.id;

        Article.delete(id)
            .then(res.status(200).json({ success: true, msg: 'Article Deleted' }))
            .catch(err => res.status(400).json({ err }));
    }
        
}
```

## models/article.js
Model handles any interaction with the database, then returns the data to the controller to render a view.

```javascript
const db = require('../config/config');

// EMPTY OBJECT
// USED FOR EXPORTING THE FUNCTIONS BELOW
const Article = {};

// CREATE ARTICLE
Article.create = (title, content) => {
    return db.none(`INSERT into articles(title, content)` + `VALUES($1, $2)`, [title, content]);
}

// GET ALL ARTICLES
Article.get = () => {
    return db.any('SELECT * FROM articles');
}

// UPDATE AN ARTICLE
Article.update = (title, content, articleID) => {
    return db.none(`UPDATE articles SET title = $1, content = $2 WHERE id = $3`, [title, content, articleID]);
}

// DELETE AN ARTICLE
Article.delete = articleID => {
    return db.none(`DELETE from articles WHERE id = $1`, articleID);
}

module.exports = Article;
```

### DOCUMENTATION
1. pg-promise: https://github.com/vitaly-t/pg-promise
2. body-parser: https://github.com/expressjs/body-parser
3. cors: https://github.com/expressjs/cors

### DOWNLOAD PROJECT & INSTALL
1. Git clone this project
2. Open up Terminal or Command line
3. Navigate to the directory where the project was cloned to
4. Run this command: psql -f ./config/db/schema.sql
5. This command will create a PostgreSQL database along with the tables
6. Setup environment variables:
    * Create .env file in your project root with this variable
```
DATABASE_URL=postgres://localhost:5432/mvc_app
```
7. To run the application, you need to install the dependencies, run this command: npm install --save
8. To start the application, run this command: npm start
9. The application will run at: localhost:3000, if that port is already in use, run this command: PORT=1738 npm start
10. This command will start the server at: localhost:1738