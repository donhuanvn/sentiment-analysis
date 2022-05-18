const path = require('path')
const { spawn } = require('child_process');

const utils = require('../utils')

const scriptVader = path.join(__dirname, '..', 'python', 'vader.py')
const currentWorkingWindow = path.join(__dirname, '..', 'python')

var status = 'ready'

exports.getStatus = () => {
  return status
}

exports.vader = (id, maxTweets, callback) => {
  status = 'busy'

  const resultId = utils.generateResultId()
  const _maxTweets = maxTweets ? maxTweets : 1000

  let python
  if (!utils.isStringNumber(id)) {
    // username case
    python = spawn(
      'python',
      [scriptVader, '--username', id, '--max-tweets', _maxTweets, '--output', `${resultId}`],
      { cwd: currentWorkingWindow });
  } else {
    // conversation id case
    python = spawn(
      'python',
      [scriptVader, '--conversation-id', id, '--max-tweets', _maxTweets, '--output', `${resultId}`],
      { cwd: currentWorkingWindow });
  }

  python.on('close', (code) => {
    // console.log(`child process close all stdio with code ${code}`);
    status = 'ready'
    if (code === 0) {
      callback(resultId)
    } else {
      callback('')
    }
  });
}
