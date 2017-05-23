const execSync = require('child_process').execSync;
const axios = require('axios');

const { slackToken, calendar } = require('./config.json')

function profileForMeeting(meeting) {
  if (meeting) {
    const [startDate, startTime, endDate, endTime, title] = meeting.split('\t');
    return encodeURIComponent(JSON.stringify({
      "status_text": `In a meeting ('${title}') which ends at ${endTime}`,
      "status_emoji": ":calendar:"
    }));
  } else {
    return encodeURIComponent(JSON.stringify({
      "status_text": "",
      "status_emoji": ""
    }));
  }
}

const agendaCommand = `
  gcalcli --calendar ${calendar} agenda --nocolor --tsv $(date +%Y-%m-%dT%H:%M:%S) $(date -v +1M +%Y-%m-%dT%H:%M:%S)
`;
const agenda = execSync(agendaCommand).toString();
const currentMeeting = agenda.split('\n').filter(x => x.trim() !== '')[0]
const profile = profileForMeeting(currentMeeting);
const endpoint = `
  https://slack.com/api/users.profile.set?token=${slackToken}&profile=${profile}&pretty=1
`;

if (currentMeeting) {
  console.log(`Setting status to ${JSON.stringify(currentMeeting.replace(/\t/, ' '))}`);
} else {
  console.log('Clearing the current status');
}

axios.get(endpoint).catch(console.log.bind(console));
