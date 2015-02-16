
var express = require('express');
var cookieParser = require('cookie-parser');
var requestLanguage = require('../');
var app = express();
var http = require('http');
var port = 3000;

app.use(cookieParser());
app.use(requestLanguage({
  languages: ['en-US', 'zh-CN'],
  cookie: {
    name: 'language',
    options: {},
    url: '/languages/{language}',
  },
  localizations: function(language) { console.log(language); }
}));

app.get('/', function(req, res) {
  res.send('ok');
});

http.createServer(app).listen(port, function() {
  console.log('Currently listening on port %s', port);
});
