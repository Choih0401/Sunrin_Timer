const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const bodyParser = require("body-parser");
const QRCode = require('qrcode')
const db = require('./db/connector');

app.use(express.static(__dirname + '/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/routers/views'));
app.engine('html',require('ejs').renderFile);

function randomString() {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var string_length = 30;
  var randomstring = '';
  for (var i=0; i<string_length; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum,rnum+1);
  }
return randomstring;
}

app.get('/',
  function (req, res) {
    insertSql = 'insert into qrgen (string, time) values (?, ?)';
    var now = new Date();
    let result = randomString();
    QRCode.toDataURL(result, function (err, url) {
      db.query(insertSql, [result, now], function(err, result){
        if(err) throw err;
        res.render('index', {
          qr:url,
          comment: "Can you decode qrcode in 3 seconds?"
        });
      })
    });
  }
);

app.post('/submit',
  function (req, res) {
    selectSql = 'select * from qrgen where string = ?';
    var now = new Date();
    let flag = req.body.inputFlag;
    if(flag.length > 80){
      flag = flag.slice(0,80);
    }
    db.query(selectSql, [flag], function(err, result){
      if(err) throw err;
      if(result.length === 0){
        res.render('index', {
          qr:"fail",
          comment: "fail"
        });
      }else{
        var old = new Date(result[0].time);
        var gep = now.getTime() - old.getTime();
        if(gep / 1000 > 3){
          res.render('index', {
            qr:"Timeout!!!!",
            comment: "Timeout!!!!"
          });
        }else{
          res.render('index', {
            qr:"success",
            comment: "LAYER{I_4m_Ironman!!!}"
          });
        }
      }
    })
  }
);


app.all('*',
  function (req, res) {
    res.status(404).send('<h1> 404 Error </h1>');
  }
);

http.listen(5000,function(){
  console.log('server on!');
});

module.exports = app;
