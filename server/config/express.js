'use strict';

/**
 * Setting up express server with all configs and middlewares.
 */


// Modules
var express = require('express');
var path = require('path');

var passport = require('passport');
var expressSession = require('express-session');
var flash    = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var methodOverride = require('method-override');
var errorhandler = require('errorhandler');

var cors = require('cors');


module.exports = function () {

    // Create app instance
    var app = express();

    //Enable All CORS Requests
    app.use(cors());


    // set up our express application
    app.use(morgan('dev')); // log every request to the console
    app.use(cookieParser()); // read cookies (needed for auth)
    app.use(bodyParser.json()); // get information from html forms
    app.use(bodyParser.urlencoded({extended: false}));   // parse application/x-www-form-urlencoded
    app.use(methodOverride('X-HTTP-Method-Override'));  //Override HTTP verbs.


    //Setup auth configuration
    require('../config/passport')(passport); // pass passport for configuration

    // configuring for passport
    app.use(expressSession({ secret: 'mySecretKey', resave: false, saveUninitialized: true})); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session


    //Set EJS for templating
    app.set ('views', path.resolve('./public/views'));
    app.set ('view engine', 'ejs');


    // Configure our routes
    require('../routes')(app, passport); // load our routes and pass in our app and fully configured passport


    //by convention define error-handling middleware last
    if (process.env.NODE_ENV !== 'prod') {
        // only use in non-prod as it gives stack trace
        app.use(errorhandler());
    }


    return app;
};