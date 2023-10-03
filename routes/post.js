const express = require('express');

const db = require('../data/database');
const router = express.Router();

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/index', async function (req, res) {
    const query = `SELECT posts.*, authors.name AS author_name FROM posts 
    INNER JOIN authors ON posts.author_id = authors.id`;
    const [posts] = await db.query(query);
    res.render('index', { posts: posts });
});

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

//use await so async is work like sync so it wait until complete
router.get('/add-post', async function (req, res) {
    // the data from db will show in [] show we add [] to variable
    // const result = await db.query('SELECT * FROM authors');
    const [myauthors] = await db.query('SELECT * FROM authors');
    res.render('add-post', { authors: myauthors });
});

router.get('/posts/:id/edit', async function (req, res) {
    const query = `SELECT * FROM posts WHERE id = ?`;
    const [posts] = await db.query(query, [req.params.id]);

    if (!posts || posts.length === 0) {
        res.status(404).render('404');
    };

    res.render('edit-post', { post: posts[0] });
});

router.post('/posts/:id/edit', async function (req, res) {
    const query = `UPDATE posts SET title =?, summary=?, body = ? WHERE id =?`;
    db.query(query, [req.body.title, req.body.summary, req.body.postContent, req.params.id,]);

    res.redirect('/index');
});


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

router.post('/posts/:id/delete', async function (req, res) {
    await db.query('DELETE FROM posts WHERE id = ?', [req.params.id]);

    res.redirect('/index');
});

module.exports = router;
