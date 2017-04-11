const path = require('path');
const express = require('express');
const cors = require('express-cors');
const bodyParser = require('body-parser')
const port = (process.env.PORT || 3000);
const app = express();
const request = require('request');
// var ToneAnalyzerV3 = require('./src/tone-analyzer');

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
// app.get('/', function (req, res) { res.send('It works!') });

// app.use('/api', router);
// app.get('/*', function (req, res) { res.sendFile(path.join(__dirname, '/../index.html')) });

app.listen(port);

app.post('/post', function(req, res){
  var query = req.body.text

  request(query, function(error, response, body) {
    if(!error && response.statusCode == 200){
      var test = 'testing this shhhiiiiiitt'

      var body = {
        response_type: "in_channel",
        text: query
      };
      res.send(body);
    }
  })
});
//get reqest to watson api
//post json object that is returned
//with a response object that posts in channel of slack

//
// var tone_analyzer = new ToneAnalyzerV3({
//   username: 'fb839465-02ce-4473-9d1e-e66acdc3b871',
//   password: 'g7jdAQ0qBqDG',
//   version_date: '2016-05-19'
// });
//
// tone_analyzer.tone({ text: 'Greetings from Watson Developer Cloud!' },
//   function(err, tone) {
//     if (err)
//       console.log(err);
//     else
//       console.log(JSON.stringify(tone, null, 2));
// });

console.log(`Listening at http://localhost:${port}`);
