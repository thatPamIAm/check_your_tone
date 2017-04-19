const path = require('path');
const express = require('express');
const app = express();
const cors = require('express-cors');
const bodyParser = require('body-parser')
const request = require('request');
const port = (process.env.PORT || 3000);
let slack = require('slack')
const Slack = require('node-slackr');

//RTM messaging Slack API requirements and Watson
const channel = 'C4WBT1K27'
const token = 'xoxb-170454401809-cWUoc4TjBkT7oSsrf7iMp53Q'
const harlan = slack.rtm.client()
let ToneAnalyzerV3 = require('./src/tone-analyzer');
const slackHook = new Slack('https://hooks.slack.com/services/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', {
  channel: "#general",
  username: "Harlan the Tone Analyzer",
});

app.locals.testing = {};

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

//***RTM w/Slack API for entire channel's history***//

//grabs channel's history upon node server starting
harlan.listen({token})

slack.channels.history({token, channel},
  (err, data) => {
    if (err)
    console.log(err);
    else
    let messages = data.messages;
    let grabAllText =  messages.map((key)=> {
      return (key.text);
    })
    makeIntoObj(grabAllText)
  })

  //creates payload to send to Watson
  function makeIntoObj(allText) {
    let noCommas = allText.join(" ")
    let channelText = {
      "body": {
        "text": noCommas
      }
    }
    sendToWatson(channelText)
  }

  function sendToWatson(req) {
    let userInput = req.body.text;
    let tone_analyzer = new ToneAnalyzerV3({
      username: 'fb839465-02ce-4473-9d1e-e66acdc3b871',
      password: 'g7jdAQ0qBqDG',
      version: 'v3',
      version_date: '2016-05-19 '
    });

    tone_analyzer.tone({ text: userInput },
      function(err, tone) {
        if (err)
          console.log(err);
        else
        let slack = tone.document_tone.tone_categories[0].tones;
        let scoreAnger = slack[0].score;
        let scoreDisgust = slack[1].score;
        let scoreFear = slack[2].score;
        let scoreJoy = slack[3].score;
        let scoreSadness = slack[4].score;
        let postToSlack = {
          "username": "Harlan the Tone Analyzer",
          "attachments": [{
            "color": "#4e7fb1",
            "pretext": "The following is an sentiment analysis of the last 100 messages in this channel",
            "author_name": "Tone Analyzer",
            "title": "A sentiment analysis of the conversation in this channel:",
            "mrkdwn_in": ["text"],
            "text":`*${slack[0].tone_name}* : ${Math.floor(scoreAnger * 100)}%
*${slack[1].tone_name}* : ${Math.floor(scoreDisgust * 100)}%
*${slack[2].tone_name}* : ${Math.floor(scoreFear * 100)}%
*${slack[3].tone_name}* : ${Math.floor(scoreJoy * 100)}%
*${slack[4].tone_name}* : ${Math.floor(scoreSadness * 100)}%`
          }]
        }
        slackHook.notify(postToSlack);
      });
    }

//***Command line slash w/Slack API for analysis of submitted text***//

app.post('/post', function(req, res){
  let userInput = req.body.text;

//instantiation of a new object with credentials
  let tone_analyzer = new ToneAnalyzerV3({
    username: process.env._USERNAME,
    password: process.env._PASSWORD,
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
      let slack = tone.document_tone.tone_categories[0].tones;
      let scoreAnger = slack[0].score;
      let scoreDisgust = slack[1].score;
      let scoreFear = slack[2].score;
      let scoreJoy = slack[3].score;
      let scoreSadness = slack[4].score;
      let postToSlack = {
        "username": "Harlan the Tone Analyzer",
        "attachments": [{
          "color": "#4e7fb1",
          "pretext": `${userInput}`,
          "author_name": "Tone Analyzer",
          "title": "A sentiment analysis of the text you entered:",
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

module.exports = app;

console.log(`Listening at http://localhost:${port}`);
