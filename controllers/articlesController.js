// REQUIRE MODEL
const Article = require('../models/article.js');

module.exports = {
  // GET ALL ARTICLES
  getArticles(req, res, next) {
    Article.get()
      .then(data => res.status(200).json({ success: true, articles: data }))
      .catch(err => res.status(400).json({ err }));
  },

  // CREATE ARTICLE
  createArticle(req, res, next) {
    // USE BODY PARSER TO EXTRACT DATA FROM CLIENT
    const { title, content } = req.body;

    Article.create(title, content)
      .then(() => res.status(201).json({ success: true, msg: 'Article created' }))
      .catch(err => res.status(400).json({ err }));
  },

  // UPDATE ARTICLE
  updateArticle(req, res, next) {
    // USE BODY PARSER TO EXTRACT DATA FROM CLIENT
    const { title, content } = req.body;
    // ID OF ARTICLE TO UPDATE
    let id = req.params.id;

    Article.update(title, content, id)
      .then(() => res.status(200).json({ success: true, msg: `Article #${id} updated` }))
      .catch(err => res.status(400).json({ err }));
  },

  // DELETE ARTICLE
  deleteArticle(req, res, next) {
    let id = req.params.id;

    Article.delete(id)
      .then(() => res.status(200).json({ success: true, msg: `Article #${id} deleted` }))
      .catch(err => res.status(400).json({ err }));
  }
};
