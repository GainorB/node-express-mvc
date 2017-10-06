const db = require('../config/config');

// EMPTY OBJECT
// USED FOR EXPORTING THE FUNCTIONS BELOW
const Article = {};

// CREATE ARTICLE
Article.create = (title, content) => {
  return db.none(`INSERT into articles(title, content)` + `VALUES($1, $2)`, [title, content]);
};

// GET ALL ARTICLES
Article.get = () => {
  return db.any('SELECT * FROM articles');
};

// UPDATE AN ARTICLE
Article.update = (title, content, id) => {
  return db.none(`UPDATE articles SET title = $1, content = $2 WHERE id = $3`, [
    title,
    content,
    id
  ]);
};

// DELETE AN ARTICLE
Article.delete = id => {
  return db.none(`DELETE from articles WHERE id = $1`, id);
};

module.exports = Article;
