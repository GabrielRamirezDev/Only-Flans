// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
const MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var fileUpload = require('express-fileupload')
// const nodemailer = require('nodemailer');

var configDB = require('./config/database.js');

var db

//email configuration===================

// var transport = nodemailer.createTransport({
//   host: "smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: "1b875fa29ee043",
//     pass: "dffff8c5325a35"
//   }
// });
// const message = {
//     from: 'elonmusk@tesla.com', // Sender address
//     to: 'to@email.com',         // List of recipients
//     subject: 'So we heard you like flan...', // Subject line
//     text: 'Here is your image!', // Plain text body
//     html: 'Embedded image: <img src="cid:unique@nodemailer.com"/>',
//     attachments: [{
//         filename: 'image.png',
//         path: './public/img/flan.jpg',
//         cid: 'unique@nodemailer.com' //same cid value as in the html img src
//     }]
// };
//   transport.sendMail(message, function(err, info) {
//     if (err) {
//       console.log(err)
//     } else {
//       console.log(info);
//     }
// });

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db);
}); // connect to our database

//app.listen(port, () => {
    // MongoClient.connect(configDB.url, { useNewUrlParser: true }, (error, client) => {
    //     if(error) {
    //         throw error;
    //     }
    //     db = client.db(configDB.dbName);
    //     console.log("Connected to `" + configDB.dbName + "`!");
    //     require('./app/routes.js')(app, passport, db);
    // });
//});

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(fileUpload());
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2019a', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
//require('./app/routes.js')(app, passport, db); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
