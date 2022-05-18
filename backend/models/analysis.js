const path = require('path')
const { spawn } = require('child_process');

const utils = require('../utils')
const syncWithClients = require('../sync-with-clients')

const scriptVader = path.join(__dirname, '..', 'python', 'vader.py')
const currentWorkingWindow = path.join(__dirname, '..', 'python')

var status = 'ready'

const getStatus = () => {
  return status
}

const changeStatus = (newStatus) => {
  if (newStatus !== 'ready' && newStatus !== 'busy')
    throw 'Analyzer Status must be ready or busy'
  status = newStatus
  syncWithClients.updateAnalyzerStatus(newStatus)
}

const vader = (id, filter, callback) => {
  changeStatus('busy')

  const resultId = utils.generateResultId()
  const maxTweets = filter.maxTweets ? filter.maxTweets : 1000

  let python
  if (!utils.isStringNumber(id)) {
    // username case
    python = spawn(
      'python',
      [scriptVader, '--username', id, '--max-tweets', maxTweets, '--output', `${resultId}`],
      { cwd: currentWorkingWindow });
  } else {
    // conversation id case
    python = spawn(
      'python',
      [scriptVader, '--conversation-id', id, '--max-tweets', maxTweets, '--output', `${resultId}`],
      { cwd: currentWorkingWindow });
  }

  python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    changeStatus('ready')
    if (code === 0) {
      callback(resultId)
    } else {
      callback('')
    }
  });
}

module.exports = {
  changeStatus,
  getStatus,
  vader
}
