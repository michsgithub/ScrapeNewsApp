// Required NPM Packages
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var axios = require ('axios');

var app = express();


// var timeout = require('connect-timeout'); //express v4
// app.use(timeout(380000));
// app.use(haltOnTimedout);
// function haltOnTimedout(req, res, next){
//   if (!req.timedout) next();
// }


// Public Settings
app.use(express.static(__dirname + '/public'));
var port = process.env.PORT || 3000;

// Database
require("./config/connection");

// BodyParser Settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

// Set up Handlebar for views
var expressHandlebars = require('express-handlebars');
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


//Routes
var routes = require('./controllers/cnbcNews.js');
app.use('/',routes);

//Port
app.listen(port, function() {
    console.log("Listening on port:" + port);
});