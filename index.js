const execSync = require('child_process').execSync;
const axios = require('axios');

const { slackToken, calendar } = require('./config.json')

function profileForMeeting(meeting) {
  if (meeting) {
    const [date, time, title] = meeting.split('  ');
    return encodeURIComponent(JSON.stringify({
      "status_text": `In a meeting ('${title}') which ends at${time}`,
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
  gcalcli --calendar ${calendar} agenda --nocolor $(date +%Y-%m-%dT%H:%M:%S) $(date -v +1M +%Y-%m-%dT%H:%M:%S)
`;
const agenda = execSync(agendaCommand).toString();
const currentMeeting = agenda.split('\n').filter(x => x.trim() !== '')[0]
const profile = profileForMeeting(currentMeeting === 'No Events Found...' ? null : currentMeeting);
const endpoint = `
  https://slack.com/api/users.profile.set?token=${slackToken}&profile=${profile}&pretty=1
`;

console.log(`Setting status to ${JSON.stringify(currentMeeting)}`);
axios.get(endpoint).catch(console.log.bind(console));
