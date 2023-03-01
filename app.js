const express = require('express');
const path = require('path');
const app = express();

//Serve static file(e.g. CSS, images)
app.use(express.static('public'));

//Activate EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"))

//Parse incoming request bodies
app.use(express.urlencoded({ extended: true }));

const defaultRoutes = require('./routes/defaults');
app.use('/', defaultRoutes);

const postsRoutes = require('./routes/post');
app.use('/', postsRoutes);

// app.use(function (req, res) {
//     res.render('404');
// });

app.use(function (error, req, res, next) {
    //Default error handling function
    //Will become active whenever any route/middleware crashes
    console.log(error);
    res.render('500');
});

app.listen(3000);