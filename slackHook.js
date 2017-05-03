const Slack = require('node-slackr');

//incoming webhook for check-your-tone channel
const slackHook = new Slack('https://hooks.slack.com/services/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', {
   channel: "#check-your-tone",
   username: "Harlan the Tone Analyzer",
});

module.exports = slackHook;
