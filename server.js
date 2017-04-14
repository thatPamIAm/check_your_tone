const path = require('path');
const express = require('express');
const cors = require('express-cors');
const bodyParser = require('body-parser')
const port = (process.env.PORT || 3000);
const app = express();
const request = require('request');

var ToneAnalyzerV3 = require('./src/tone-analyzer');


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

app.get('/', function (req, res) { res.sendFile(path.join(__dirname, './index.html')) });
app.get('/*', function (req, res) { res.sendFile(path.join(__dirname, './index.html')) });

app.listen(port);

//post triggered by Slack
app.post('/post', function(req, res){
  var userInput = req.body.text;
//instantiation of a new object with credentials
  var tone_analyzer = new ToneAnalyzerV3({
    username: "fb839465-02ce-4473-9d1e-e66acdc3b871",
    password: 'g7jdAQ0qBqDG',

    // username: process.env._USERNAME,
    // password: process.env._PASSWORD,
    version: 'v3',
    version_date: '2016-05-19 '
  });
//call to Watson's API through tone method/request in IBM files
  tone_analyzer.tone({ text: userInput },
    function(err, tone) {
      //throw console log error if params not good
      if (err)
      console.log(err);
      else
      // create object from results for posting to Slack
      var slack = tone.document_tone.tone_categories[0].tones;
      var scoreAnger = slack[0].score;
      var scoreDisgust = slack[1].score;
      var scoreFear = slack[2].score;
      var scoreJoy = slack[3].score;
      var scoreSadness = slack[4].score;
      var postToSlack = {
        "username": "TONE ANALYZER",
        "attachments": [{
          "color": "#4e7fb1",
          "pretext": `${userInput}`,
          "author_name": "Tone Analyzer",
          "title": "An sentiment analysis of the text you entered:",
          "mrkdwn_in": ["text"],
          "text":`*${slack[0].tone_name}* : ${Math.floor(scoreAnger * 100)}%
*${slack[1].tone_name}* : ${Math.floor(scoreDisgust * 100)}%
*${slack[2].tone_name}* : ${Math.floor(scoreFear * 100)}%
*${slack[3].tone_name}* : ${Math.floor(scoreJoy * 100)}%
*${slack[4].tone_name}* : ${Math.floor(scoreSadness * 100)}%`
        }]
      }
      res.send(postToSlack);
  });
});

  console.log(`Listening at http://localhost:${port}`);
