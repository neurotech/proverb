// =========
// TODO
// =========

// - Jade polish
// - SASS polish
// - Add prepositions dictionary
// - Get bower working in the right dirs with bower.json etc

// Modules
var express = require('express');
var sass = require('node-sass');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

var app = express();

app.set('port', process.env.PORT || 4242);
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'jade');
app.use(express.favicon(path.join(__dirname, '/public/favicon.ico')));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(sass.middleware({
  src: path.join(__dirname, '/src'),
  dest: path.join(__dirname, '/public'),
  debug: true,
  outputStyle: 'compressed'
}));
app.use(express.static(path.join(__dirname, '/public')));

// Development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Set data sources
var proverbPath = path.join(__dirname, 'data/proverbs.json');
var adverbPath = path.join(__dirname, 'data/adverbs.json');
var verbPath = path.join(__dirname, 'data/verbs.json');
var prepPath = path.join(__dirname, 'data/prepositions.json');
var adjectivePath = path.join(__dirname, 'data/adjectives.json');
var nounPath = path.join(__dirname, 'data/nouns.json');

// Parse data sources
var proverbs = JSON.parse(fs.readFileSync(proverbPath));
var adverbs = JSON.parse(fs.readFileSync(adverbPath));
var verbs = JSON.parse(fs.readFileSync(verbPath));
var prepositions = JSON.parse(fs.readFileSync(prepPath));
var adjectives = JSON.parse(fs.readFileSync(adjectivePath));
var nouns = JSON.parse(fs.readFileSync(nounPath));

app.get('/proverb', function(req, res) {
  var shuffled = _.sample(proverbs);

  res.render('index', {
    total: proverbs.length,
    episode: shuffled.episode,
    name: shuffled.title,
    proverb: shuffled.proverb,
    adverb: _.sample(adverbs),
    verb: _.sample(verbs),
    preposition: _.sample(prepositions),
    adjective: _.sample(adjectives),
    noun: _.sample(nouns)
  });
});

app.get('/json', function(req, res) {
  res.json(200, _.sample(proverbs));
});

app.get('/json/all', function(req, res) {
  res.json(200, proverbs);
});

app.listen(app.get('port'), function (err, status) {
  if (err) {
    console.log(err);
  }
});
