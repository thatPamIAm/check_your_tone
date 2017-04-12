const path = require('path');
const express = require('express');
const cors = require('express-cors');
const bodyParser = require('body-parser')
const port = (process.env.PORT || 3000);
const app = express();
const request = require('request');
var watson = require('watson-developer-cloud');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); //should this be false???
app.use(bodyParser.json());

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('./webpack.config.js');
  const compiler = webpack(config);

  app.use(webpackHotMiddleware(compiler));
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));
}

app.use(express.static('app'));

//`./${process.env.INDEX_SRC}`
app.get('/', function (req, res) { res.sendFile(path.join(__dirname, './index.html')) });
app.get('/*', function (req, res) { res.sendFile(path.join(__dirname, './index.html')) });
// app.get('/', function(req, res) {res.send('Running!!'); });

app.listen(port);


//req.params??? and pass in username/password/text
//ibm watson requires header and body
app.post('/post', function(req, res){
  console.log('post is working')
  var text = req.body.text;

  var tone_analyzer = watson.tone_analyzer({
    username: process.env._USERNAME,
    password: process.env._PASSWORD,
    version: 'v3',
    version_date: '2016-05-19 '
  });

  //options for get
  //host
  //port
  //path
  //method
  request(payload, function(error, response, body) {
    if(!error && response.code === 200){
      // res.status(200)
      tone_analyzer.tone({ text: text },
        function(err, tone) {
          if (err)
          console.log(err);
          else
          console.log(JSON.stringify(tone, null, 2));
        });
      }
    }  // res.send(body)
  });


// app.post('/post', function(req, res){
//   var text = req.body.text;
//
//   var payload = {
//     text: text
//   }
//
//   request(payload, function(error, response, body) {
//     if(!error && response.code === 200){
//       var test = 'testing this shhhiiiiiitt'
//
//       var body = {
//         response_type: "in_channel",
//         text: test
//       };
//       res.send(body);
//     }
//   })
// });

console.log(`Listening at http://localhost:${port}`);