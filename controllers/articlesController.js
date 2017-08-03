const express = require('express');
const router = express.Router();

// REQUIRE MODEL
const Article = require('../models/article.js');

// GET ALL ARTICLES
router.get('/', (req, res, next) => {
    Article.get()
        //.then(data => console.log(data))
        //.then(data => res.render('index', { data }))
        .then(data => res.status(200).json({ title: 'Retreived all Articles', success: true, data }))
        .catch(err => res.status(400).json({ err }));
});

// CREATE ARTICLE
router.post('/new', (req, res, next) => {
    // USE BODY PARSER TO EXTRACT DATA FROM CLIENT
    const { title, content } = req.body;

    Article.create(title, content)
        .then(res.status(201).json({ success: true, msg: 'Article Created' }))
        .catch(err => res.status(400).json({ err }));
});

// UPDATE ARTICLE
router.put('/update/article/:id', (req, res, next) => {
    // USE BODY PARSER TO EXTRACT DATA FROM CLIENT
    const { title, content } = req.body;
    // ID OF ARTICLE TO UPDATE
    let id = req.params.id;

    Article.update(title, content, id)
        .then(res.status(200).json({ success: true, msg: 'Article Updated' }))
        .catch(err => res.status(400).json({ err }));
});

// DELETE ARTICLE
router.delete('/delete/article/:id', (req, res, next) => {
    let id = req.params.id;

    Article.delete(id)
        .then(res.status(200).json({ success: true, msg: 'Article Deleted' }))
        .catch(err => res.status(400).json({ err }));
});


module.exports = router;