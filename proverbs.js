// Modules
var express = require('express');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var config = require('./src/config.json');

var app = express();
var env = process.env.NODE_ENV || 'development';

// Express configuration
app.set('env', env);
app.set('port', process.env.PORT || config.server.port);
app.enable('trust proxy');
app.enable('strict routing');
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

// Development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Routes
app.get('/', function(req, res) {
  var shuffled = _.sample(config.dictionary.proverbs);

  res.render('index', {
    total: config.dictionary.proverbs.length,
    episode: shuffled.episode,
    name: shuffled.title,
    proverb: shuffled.proverb,
    adverb: _.sample(config.dictionary.adverbs),
    verb: _.sample(config.dictionary.verbs),
    preposition: _.sample(config.dictionary.prepositions),
    adjective: _.sample(config.dictionary.adjectives),
    noun: _.sample(config.dictionary.nouns)
  });
});

app.get('/json', function(req, res) {
  res.json(200, _.sample(config.dictionary.proverbs));
});

app.get('/json/all', function(req, res) {
  res.json(200, config.dictionary.proverbs);
});

app.listen(app.get('port'), function (err, status) {
  if (err) {
    console.log(err);
  }
  console.log('Proverbs serving in ' + env + ' mode.');
});