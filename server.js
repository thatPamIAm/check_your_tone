const path = require('path');
const express = require('express');
const cors = require('express-cors');
const bodyParser = require('body-parser')
const port = (process.env.PORT || 3000);
const app = express();
const request = require('request');
const Chart = require('chart.js')

var ToneAnalyzerV3 = require('./src/tone-analyzer');
// var slackPie = new Chart(ctx, {
//   type:'pie',
//   data: data,
//   options: options
// })

var testSlack = {
    "text": "New comic book alert! _The Further Adventures of Slackbot_, Volume 1, Issue 3."
}


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
  var text = req.body.text;
//instantiation of a new object with credentials
  var tone_analyzer = new ToneAnalyzerV3({
    username: process.env._USERNAME,
    password: process.env._PASSWORD,
    version: 'v3',
    version_date: '2016-05-19 '
  });
//call to Watson's API
  tone_analyzer.tone({ text: text },
    function(err, tone) {
      //throw console log error if params not good
      if (err)
      // take anaylsis and map through
      else
      var postToSlack = tone.document_tone.tone_categories[0].tones.map(key => {
        return key.tone_name + ": " + key.score;
        console.log('it should totally be working')
      });
      //need to send original text back through. check to see if send can take two arguments.
      res.send(testSlack);
  });
});

//object
//key labels: ['emotion', 'emotion']
//key datasets: [
//  {
//    key of data: [num, num],
//    key of backgroundColor: ["#color", '#color', '#color']
//  }
//]




  console.log(`Listening at http://localhost:${port}`);
