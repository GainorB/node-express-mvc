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