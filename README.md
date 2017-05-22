# slack-gcal-status

![image](https://cloud.githubusercontent.com/assets/691940/26310573/88a1acbe-3f01-11e7-8c8c-b310b4ace9e5.png)

Node application that updates your Slack status according to your current meeting.

It clears the status if you're not in a meeting.

## Pre-requisites
- node
- [gcalcli](https://github.com/insanum/gcalcli)
  - install with `pip install gcalcli`
  - run `gcalcli agenda` to configure its authentication
  
## Installation
- clone the repo
- run `yarn` (or `npm install`) to install the dependencies
- create a file `config.json` with these two keys:

  ```json
  {
    "slackToken": "xosometoken-123123",
    "calendar": "myname@buildo.io
  ```
  
   - You can get a Slack token from https://api.slack.com/custom-integrations/legacy-tokens.
   - `calendar` is the name of your calendar (usually `yourname@buildo.io`)
      
- run `node index.js` to update the status

## Continuously update
The command will update the status once. In order to continuously update the status, you'll have to schedule its run with an external tool.

Personally, I simply sneaked the call to the app into this BitBar plugin https://github.com/buildo/bitbar-plugins/tree/master/next-meeting, so that whenever the status bar is updated with my next meeting, Slack is updated with my current meeting.

Of course, you can get creative (cron, systemd, whatever)
