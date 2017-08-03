const express = require('express');
const router = express.Router();

// REQUIRE MODEL
const Article = require('../models/article.js');

// GET ALL ARTICLES
router.get('/', (req, res, next) => {
    Article.get()
        //.then(data => console.log(data))
        //.then(data => res.render('index', { data }))
        .then(data => res.json({ title: 'Retreived all Articles', success: true, data }))
        .catch(err => res.json({ err }));
});

// CREATE ARTICLE
router.post('/new', (req, res, next) => {
    // USE BODY PARSER TO EXTRACT DATA FROM CLIENT
    const { title, content } = req.body;

    Article.create(title, content)
        .then(res.json({ success: true, msg: 'Article Created' }))
        .catch(err => res.json({ err }));
});

// UPDATE ARTICLE
router.put('/update/article/:id', (req, res, next) => {
    // USE BODY PARSER TO EXTRACT DATA FROM CLIENT
    const { title, content } = req.body;
    // ID OF ARTICLE TO UPDATE
    let id = req.params.id;

    Article.update(title, content, id)
        .then(res.json({ success: true, msg: 'Article Updated' }))
        .catch(err => res.json({ err }));
});

// DELETE ARTICLE
router.delete('/delete/article/:id', (req, res, next) => {
    let id = req.params.id;

    Article.delete(id)
        .then(res.json({ success: true, msg: 'Article Deleted' }))
        .catch(err => res.json({ err }));
});


module.exports = router;