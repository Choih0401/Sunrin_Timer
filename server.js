const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const bodyParser = require("body-parser");

app.use(express.static(__dirname + '/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'pug'); 
app.set('views', path.join(__dirname, '/routers/views'));
app.engine('html',require('pug').renderFile);


app.get('/',
  function (req, res) {
    res.sendFile(__dirname +  '/index.html');
  }
);


app.all('*',
  function (req, res) {
    res.status(404).send('<h1> 404 Error </h1>');
  }
);

http.listen(80,function(){
  console.log('server on!');
});

module.exports = app;
