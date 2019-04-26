// app.js

// Require Libraries
var http = require('http');
var express = require('express');
var exphbs  = require('express-handlebars');
var giphy = require('giphy-api')();
// App Setup
var app = express();

app.use(express.static('public'));

// Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

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

// REQUIRE HTTP MODULE

app.get('/', (req, res) => {
  console.log(req.query.term)
  const queryString = req.query.term;
  // ENCODE THE QUERY STRING TO REMOVE WHITE SPACES AND RESTRICTED CHARACTERS
  const term = encodeURIComponent(queryString);
  // PUT THE SEARCH TERM INTO THE GIPHY API SEARCH URL
  const url = 'http://api.giphy.com/v1/gifs/search?q=' + term + '&api_key=dc6zaTOxFJmzC'

  http.get(url, (response) => {
    // SET ENCODING OF RESPONSE TO UTF8
    response.setEncoding('utf8');

    var body = '';

    response.on('data', (d) => {
      // CONTINUOUSLY UPDATE STREAM WITH DATA FROM GIPHY
      body += d;
    });

    response.on('end', () => {
      // WHEN DATA IS FULLY RECEIVED PARSE INTO JSON
      const gifs = JSON.parse(body).data
      // RENDER THE HOME TEMPLATE AND PASS THE GIF DATA IN TO THE TEMPLATE
      res.render('home', { gifs });
    });
  });
});

// Routes

app.get('/hello-gif', function (req, res) {
  var gifUrl = 'http://media2.giphy.com/media/gYBVM1igrlzH2/giphy.gif'
  res.render('hello-gif', {gifUrl: gifUrl})
})

// GIPHY API Route

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
