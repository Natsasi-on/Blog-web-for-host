const express = require('express');
const db = require('../data/database');
const router = express.Router();

// Render the index page
router.get('/', function (req, res) {
    res.render('index');
});

// Retrieve and render posts from the database
router.get('/index', async function (req, res) {
    const query = `SELECT posts.*, authors.name AS author_name FROM posts 
    INNER JOIN authors ON posts.author_id = authors.id`;
    const [posts] = await db.query(query);
    res.render('index', { posts: posts });
});

// Handle the creation of a new post
router.post('/index', async function (req, res) {
    const data = [
        req.body.title,
        req.body.summary,
        req.body.postContent,
        req.body.author,
    ]
    await db.query('INSERT INTO posts (title, summary, body, author_id) VALUES (?)', [data]);
    res.redirect('/index');
});

// Render the add-post page with a list of authors
router.get('/add-post', async function (req, res) {
    const [myauthors] = await db.query('SELECT * FROM authors');
    res.render('add-post', { authors: myauthors });
});

// Render the edit-post page for a specific post
router.get('/posts/:id/edit', async function (req, res) {
    const query = `SELECT * FROM posts WHERE id = ?`;
    const [posts] = await db.query(query, [req.params.id]);

    if (!posts || posts.length === 0) {
        res.status(404).render('404');
    };

    res.render('edit-post', { post: posts[0] });
});

// Handle the update of a post
router.post('/posts/:id/edit', async function (req, res) {
    const query = `UPDATE posts SET title =?, summary=?, body = ? WHERE id =?`;
    db.query(query, [req.body.title, req.body.summary, req.body.postContent, req.params.id]);

    res.redirect('/index');
});

// Render the post-detail page for a specific post
router.get('/posts/:id', async function (req, res) {
    const query = `SELECT posts.*, authors.name AS author_name, authors.email AS author_email FROM posts 
    INNER JOIN authors ON posts.author_id = authors.id
    WHERE posts.id = ?`;

    const [posts] = await db.query(query, [req.params.id]);

    if (!posts || posts.length === 0) {
        res.status(404).render('404');
    };

    const postData = {
        ...posts[0],
        date: posts[0].date.toISOString(),
        humanReadableDate: posts[0].date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
    };

    res.render('post-detail', { post: postData });
});

// Handle the deletion of a post
router.post('/posts/:id/delete', async function (req, res) {
    await db.query('DELETE FROM posts WHERE id = ?', [req.params.id]);

    res.redirect('/index');
});

module.exports = router;
