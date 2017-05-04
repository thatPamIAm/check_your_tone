const path = require('path')
const express = require('express')
const app = express()
const cors = require('express-cors')
const bodyParser = require('body-parser')
const request = require('request')
const port = (process.env.PORT || 3000)
var slack = require('slack')
const Slack = require('node-slackr');
const token = process.env._BOT_TOKEN

//files
var ToneAnalyzerV3 = require('./src/tone-analyzer')
const channelNames = require('./src/channelNames')

app.locals.testing = {}
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const config = require('./webpack.config.js')
  const compiler = webpack(config)

  app.use(webpackHotMiddleware(compiler))
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }))
}

app.use(express.static('app'))
app.get('/', function (req, res) { res.sendFile(path.join(__dirname, './index.html')) })
app.get('/*', function (req, res) { res.sendFile(path.join(__dirname, './index.html')) })
app.listen(port)

//***RTM, Events w/Slack API for entire channel's history***//

// webhook, slackbot, and channelName where bot is called
const slackHook = new Slack(process.env._SLACKHOOK, {
  channel: "#check-your-tone",
  username: "Harlan the Tone Analyzer",
});
var harlan = slack.rtm.client()
let userCurrentChannel

//internal check for server and initial payload
harlan.started(function(payload) {
// var channelsPayload = payload.channels.reduce((object, channel) => {
//     object[channel.id] = channel.name
//
//     return object
}, {})
// console.log(channelsPayload)
//   return channelsPayload
  console.log('harlan is ready to go')
})

function runHarlan(){
  //event listener for messages in all public slack channels
  harlan.message(message => {
    if (isInAChannel(message) &&
        callsHarlan(message)) {
      let currentChannel = message.channel
      grabChannelName(currentChannel)
      pullChannelHistory(token, currentChannel)
    }
  })
}

//check for message text of 'tone check' or 'harlan'
function callsHarlan(message) {
  return message.text.toLowerCase().indexOf('check your tone') > -1 ||
     message.text.toLowerCase().indexOf('harlan') > -1;
};

//check that message is being received in public channel
function isInAChannel(message) {
  return typeof message.channel === 'string' &&
      message.channel[0] === 'C';
}

//convert channelID to channelName
function grabChannelName(id){
  return Object.keys(channelNames).map((key) => {
    if (key === id) {
      var name = channelNames[key]
      userCurrentChannel = name
    }
    return userCurrentChannel
  })
}

// Pull back last 100 messages of channel to send to Watson API for analysis
function pullChannelHistory(token, channel){
slack.channels.history({token, channel},
  (err, data) => {
    if (err)
      console.log(err)
    else
    var messages = data.messages
    var grabAllText =  messages.map((key)=> {
      return (key.text)
    })
    var obj = makeIntoObj(grabAllText)
    sendToWatson(obj)
  })
}

//creates payload to send to Watson
  function makeIntoObj(allText) {
    var noCommas = allText.join(" ")
    var channelText = {
      "body": {
        "text": noCommas
      }
    }
    return channelText
  }

  //sends text to Watson API
  function sendToWatson(req) {
    var userInput = req.body.text
    //instantiation of a new Tone Analyzer constructor with credentials
    var tone_analyzer = new ToneAnalyzerV3({
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
      console.log(err)
    else
    // create object from results for posting to Slack
    var slack = tone.document_tone.tone_categories[0].tones
    var scoreAnger = slack[0].score
    var scoreDisgust = slack[1].score
    var scoreFear = slack[2].score
    var scoreJoy = slack[3].score
    var scoreSadness = slack[4].score
    //indentation intentional on postToSlack object for display purposes in Slack
    var postToSlack = {
      "username": "Harlan the Tone Analyzer",
      "attachments": [{
        "color": "#4e7fb1",
        "pretext": `Did someone mention tone? The following is a sentiment analysis for the last 100 messages in #${userCurrentChannel}!`,
        "author_name": "Tone Analyzer",
        "title": "For each emotion, a score of less than 50% indicates that the emotion is unlikely to be perceived in the content. Likewise, a score greater than 75% indicates high likelihood that the emotion will be perceived.",
        "mrkdwn_in": ["text"],
        "text":`*${slack[0].tone_name}* : ${Math.floor(scoreAnger * 100)}%
*${slack[1].tone_name}* : ${Math.floor(scoreDisgust * 100)}%
*${slack[2].tone_name}* : ${Math.floor(scoreFear * 100)}%
*${slack[3].tone_name}* : ${Math.floor(scoreJoy * 100)}%
*${slack[4].tone_name}* : ${Math.floor(scoreSadness * 100)}%`
      }]
    }
    slackHook.notify(postToSlack)
  });
}

//***Command line slash for analysis of submitted text***//

app.post('/post', function(req, res){
  var userInput = req.body.text
//instantiation of a new Tone Analyzer constructor with credentials
  var tone_analyzer = new ToneAnalyzerV3({
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
        console.log(err)
      else
      // create object from results for posting to Slack
      var slack = tone.document_tone.tone_categories[0].tones
      var scoreAnger = slack[0].score
      var scoreDisgust = slack[1].score
      var scoreFear = slack[2].score
      var scoreJoy = slack[3].score
      var scoreSadness = slack[4].score
      //indentation intentional on postToSlack object for display purposes in Slack
      var postToSlack = {
        "username": "Harlan the Tone Analyzer",
        "attachments": [{
          "color": "#4e7fb1",
          "pretext": `${userInput}`,
          "author_name": "Tone Analyzer",
          "title": "For each emotion, a score of less than 50% indicates that the emotion is unlikely to be perceived in the content. Likewise, a score greater than 75% indicates high likelihood that the emotion will be perceived.",
          "mrkdwn_in": ["text"],
          "text":`*${slack[0].tone_name}* : ${Math.floor(scoreAnger * 100)}%
*${slack[1].tone_name}* : ${Math.floor(scoreDisgust * 100)}%
*${slack[2].tone_name}* : ${Math.floor(scoreFear * 100)}%
*${slack[3].tone_name}* : ${Math.floor(scoreJoy * 100)}%
*${slack[4].tone_name}* : ${Math.floor(scoreSadness * 100)}%`
        }]
      }
      res.send(postToSlack)
  });
});

runHarlan()

harlan.listen({token})

module.exports = app
