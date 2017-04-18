var SlackClient = require('slack-client');
var RtmClient = require('@slack/client').RTMClient;

var bot_token = process.env.SLACK_BOT_TOKEN || ''

var Harlan = new RTMCLient(bot_token);

Harlan.start();
