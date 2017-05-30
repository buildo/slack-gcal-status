const execSync = require('child_process').execSync;
const axios = require('axios');
const moment = require('moment');

const configurations = require('./config.json');

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

function updateStatus({ slackToken, calendar }) {
  const now = moment().format();
  const nowPlus1m = moment().add(1, 'minute').format();

  const agendaCommand = `
    gcalcli --calendar ${calendar} agenda --nocolor --tsv ${now} ${nowPlus1m}
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

  return axios.get(endpoint).catch(console.log.bind(console));
}

configurations.forEach(updateStatus);
