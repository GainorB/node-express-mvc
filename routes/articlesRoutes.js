// REQUIRE CONTROLLER
const ArticlesController = require('../controllers/articlesController');

module.exports = app => {
  app.get('/', ArticlesController.getArticles);
  app.post('/new', ArticlesController.createArticle);
  app.put('/update/article/:id', ArticlesController.updateArticle);
  app.delete('/delete/article/:id', ArticlesController.deleteArticle);
};
