var express = require('express');
var path = require('path');
var compression = require('compression');
var bodyParser = require('body-parser');
var consign = require('consign');
var logger = require('morgan');
var helmet = require("helmet"); 

var app = express();

app.disable('x-powered-by');

app.use(compression());

app.use(logger('dev'));
app.use(helmet()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

consign()
  .include('models')
  .then('controllers')
  .then('routes')
  .into(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

module.exports = app;
