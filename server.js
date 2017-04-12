const path = require('path');
const express = require('express');
const cors = require('express-cors');
const bodyParser = require('body-parser')
const port = (process.env.PORT || 3000);
const app = express();
const request = require('request');
var watson = require('watson-developer-cloud');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
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

app.get('/', function (req, res) { res.sendFile(path.join(__dirname, './index.html')) });
app.get('/*', function (req, res) { res.sendFile(path.join(__dirname, '/../index.html')) });

app.listen(port);

app.post('/post', function(req, res){
  var tone_analyzer = watson.tone_analyzer({
    username: process.env._USERNAME,
    password: process.env._PASSWORD,
    version: 'v3',
    version_date: '2016-05-19 '
  });

  tone_analyzer.tone({ text: 'Greetings from Watson Developer Cloud!' },
  function(err, tone) {
    if (err)
    console.log(err);
    else
    console.log(JSON.stringify(tone, null, 2));
  });
});

// app.post('/post', function(req, res){
//   var text = req.body.text
//   var commandPayload = {
//     text:'Hello' + text
//   }
//   var parsed_url = url.format({
//     pathname:'https://gateway.watsonplatform.net/tone-analyzer/api',
//
//   })
//
//   request(parsed_url, function(error, response, body) {
//     if(!error){
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
