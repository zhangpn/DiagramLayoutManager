/**
 * Created by zhangpn on 4/25/2015.
 */
var express  = require('express');
var app      = express();                               // create our app w/ express
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

app.use(express.static(__dirname));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));

app.listen(8080);
console.log("App listening on port 8080");