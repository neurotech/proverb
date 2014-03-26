// =========
// TODO
// =========

// - Create array of past-tense verbs, adjectives, nouns to be randomly grouped for attribution line.
//   - i.e. 'This proverb {verb} to your {adjective} {noun} by {episode} - '{name}'.'
// - Improve health function
// - Jade template polish
// - Stylus files polish


// Modules
var express = require('express');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

var app = express();

app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'jade');
app.use(express.favicon(path.join(__dirname, '/public/favicon.ico')));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(require('stylus').middleware(path.join(__dirname, '/src/stylesheets')));
app.use(express.static(path.join(__dirname, '/public')));

// Development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var filepath = path.join(__dirname, 'proverbs.json');
var proverbs = JSON.parse(fs.readFileSync(filepath));

function health() {
  return {
    pid: process.pid,
    memory: process.memoryUsage(),
    uptime: process.uptime()
  };
};

app.get('/', function(req, res) {
  res.render('index', {
    episode: _.sample(proverbs).episode,
    name: _.sample(proverbs).title,
    proverb: _.sample(proverbs).proverb
  });
});

app.get('/json', function(req, res) {
  res.json(200, _.sample(proverbs));
});

app.get('/json/all', function(req, res) {
  res.json(200, proverbs);
});

app.get('/health', function(req, res){
  res.json(200, health());
});

app.listen(app.get('port'), function (err, status) {
  if (err) {
    console.log(err);
  }
});