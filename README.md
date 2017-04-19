## Check Your Tone

### Module 3 FE Personal Project

### Project Pitch

Sentiment analysis software has typically been used to monitor consumers' opinions of events, products, and services through social media and other digital outlets. In recent years, a number of companies have implemented this same technology in workplace channels in order to gauge employee morale and anticipate such things as fraud, employee turnover, and potential litigation.

Since Slack serves as one the primary forms of communication for the students and staff at Turing, it makes sense (for the betterment of the community as a whole) to utilize the data available in channels to get a regular "pulse" of how the community is doing. The use of emotion analysis software within the Slack environment could not only give us a clearer view of where the community stands as a whole or in different cohorts, but could also give individuals the opportunity to help adjust the tones of certain channels or do a check of their own tone before posting or sending a message.

This is important because of the phenomenon of emotional contagion. Emotional contagion is a type of interpersonal influence (long recognized in the psychological literature) that speaks to how other peoples' feelings influence our own emotions and behavior. Consciously managing one's emotions (or at least being aware of what emotions one is spreading) is an important factor in creating a collaborative, positive school environment at Turing.

The goal of this project is to create a slackbot (specifically utilizing the command slash API) that would allow any Slack user to input text for tone analysis. The five emotions that would be analyzed are as follows: Anger, disgust, fear, joy, and sadness. The slackbot would give the user a breakdown of whether each emotion is likely to be perceived in the content of the submitted message. The extension of this project will utilize the Real-Time-Messaging API through Slack to analyze the tone of entire channels within a set date range.

TLDR: Building a slackbot that will allow users to input text for tone analysis through IBM Watson's Tone Analyzer. The extension of this project would give a weekly summary of the overall tone of a channel.

### APIS

[https://www.ibm.com/watson/developercloud/tone-analyzer/api/v3/](Watson Tone Analyzer) [https://api.slack.com/slash-commands](Slash Commands via Slack)
[https://api.slack.com/rtm](Slack Real-Time-Messaging API)

### Reflection

In preparation for this project, I followed two tutorials that showed how you could build basic slackbots in Slack. I also did an extensive amount of reading about express and node so that I could wrap my head around how all of the APIs would work together in the BE.

This personal project was, by far, the most exciting project that I've done here at Turing. Although my background in English Literature and love of semantics, sociology, and psychology drove me to hack away at this project... I do have to credit the environment I've been exposed to at Turing for giving me the confidence to dive into new technologies that I had never been exposed to before. Despite having a tiny amount of reservation about branching out on my own, I found that, in doing so, I learned a lot more than I would have otherwise. I also found it incredibly exciting.

### Next Phase

I was able to implement both my MVP as well as my extension for pulling back the history of the general slack channel.

Next phase will include:

* More refactoring!!
* Colored bar graphs posted to slack to give a visual of the data coming back from the analysis. I researched this extensively, but was unable to find a working solution
