let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let expressJWT = require('express-jwt');
let secretOrPrivateKey = "secret expressJWT"  

let authRouter = require('./routes/auth');
let peopleRouter = require('./routes/people')


let app = express();
app.listen(80);

app.use(expressJWT({
    secret: secretOrPrivateKey   
}).unless({
    path: ['/auth/tokens', '/auth/users', {url:'/api/people', method:['GET']}]  // '/api/people'
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/api/people', peopleRouter);

app.use(function(req, res, next) {
  res.send(404)
});

// error handler
app.use(function(err, req, res, next) {
    console.log(err)
    if (err.name === 'UnauthorizedError') {   
      res.status(401).send('invalid token...');
      return
    }
    res.status(err.status || 500).send("error");
});

module.exports = app;
