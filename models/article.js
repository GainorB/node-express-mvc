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