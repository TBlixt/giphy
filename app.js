// app.js

// Require Libraries
var express = require('express');
var exphbs  = require('express-handlebars');
var giphy = require('giphy-api')();
// App Setup
var app = express();

// Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/hello-gif', function (req, res) {
  var gifUrl = 'http://media2.giphy.com/media/gYBVM1igrlzH2/giphy.gif'
  res.render('hello-gif', {gifUrl: gifUrl})
})

// Routes
app.get('/greetings/:name', function (req, res) {
  var name = req.params.name;
  res.render('greetings', {name: name});
})

// example URL "http://localhost:3000/?term=hey"
app.get('/', (req, res) => {
  console.log(req.query) // => "{ term: hey" }
  res.render('home')
})

app.get('/', (req, res) => {
  giphy.search(req.query.term, (err, response) => {
    const gifs = response.data;
    res.render('home', { gifs })
  });
});

// Start Server

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
