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