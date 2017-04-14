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
  var text = req.body.text;
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
  tone_analyzer.tone({ text: text },
    function(err, tone) {
      //throw console log error if params not good
      if (err)
      console.log(err);
      else
      // console.log(tone)
      var slack = tone.document_tone.tone_categories[0].tones
      var myJSONstr = {
        "username": "TONE ANALYZER",
        "attachments": [{
          "color": "#9C1A22",
          "pretext": "An sentiment analysis of the text you entered:",
          "author_name": "Tone Analyzer",
          "title": "Emotional much?",
          "text":
            `${slack[0].tone_name} : ${slack[0].score},
             ${slack[1].tone_name} : ${slack[1].score},
             ${slack[2].tone_name} : ${slack[2].score},
             ${slack[3].tone_name} : ${slack[3].score},
             ${slack[4].tone_name} : ${slack[4].score}`
        }]
      }
      console.log(slack)
      console.log(myJSONstr)
      //     }
      //     return postToSlack
      // });
      res.send(myJSONstr);
  });
});
// title: `${key.tone_name}`,
// text: `${key.score}`
  console.log(`Listening at http://localhost:${port}`);
  //
  // var myJSONStr = 'payload= {
  //     "username": "SALE BOT",
  //     "icon_url": "example.com/img/icon.jpg",
  //     "attachments": [{
  //         "fallback": "This attachement isn't supported.",
  //         "title": "VALENTINE'S DAY OFFER",
  //         "color": "#9C1A22",
  //         "pretext": "Today's list of awesome offers picked for you",
  //         "author_name": "Preethi",
  //         "author_link": "http://www.hongkiat.com/blog/author/preethi/",
  //         "author_icon": "http://media05.hongkiat.com/author/preethi.jpg",
  //         "fields": [{
  //             "title": "Sites",
  //             "value": "_<http://www.amazon.com|Amazon>_\n_<http://www.ebay.com|Ebay>_",
  //             "short": true
  //         }, {
  //             "title": "Offer Code",
  //             "value": "UI90O22\n-",
  //             "short": true
  //         }],
  //         "mrkdwn_in": ["text", "fields"],
  //         "text": "Just click the site names and start buying. Get *extra reduction with the offer code*, if provided.",
  //         "thumb_url": "http://example.com/thumbnail.jpg"
  //     }]
  // }';
