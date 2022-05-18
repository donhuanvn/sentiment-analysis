const path = require('path')
const { spawn } = require('child_process');

const utils = require('../utils')
const syncWithClients = require('../sync-with-clients')

const scriptVader = path.join(__dirname, '..', 'python', 'vader.py')
const scriptLstm = path.join(__dirname, '..', 'python', 'lstm.py')
const currentWorkingWindow = path.join(__dirname, '..', 'python')

const STATUS_READY = 'ready'
const STATUS_BUSY = 'busy'
var status = STATUS_READY

const getStatus = () => {
  return status
}

const changeStatus = (newStatus) => {
  if (newStatus !== STATUS_READY && newStatus !== STATUS_BUSY)
    throw 'Analyzer Status must be ready or busy'
  status = newStatus
  syncWithClients.updateAnalyzerStatus(newStatus)
}

const vader = (id, filter, callback) => {
  changeStatus(STATUS_BUSY)

  const resultId = utils.generateResultId()
  const maxTweets = filter.maxTweets ? filter.maxTweets : 1000

  let python
  if (!utils.isStringNumber(id)) {
    // username case
    const args = [scriptVader, '--username', id, '--max-tweets', maxTweets, '--output', `${resultId}`]
    console.log(args)
    python = spawn('python', args, { cwd: currentWorkingWindow });
  } else {
    // conversation id case
    const args = [scriptVader, '--conversation-id', id, '--max-tweets', maxTweets, '--output', `${resultId}`]
    console.log(args)
    python = spawn('python', args, { cwd: currentWorkingWindow });
  }

  python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    changeStatus(STATUS_READY)
    if (code === 0) {
      callback(resultId)
    } else {
      callback('')
    }
  });
}

const lstm = (id, filter, callback) => {
  changeStatus(STATUS_BUSY)

  const resultId = utils.generateResultId()
  const maxTweets = filter.maxTweets ? filter.maxTweets : 1000

  let python
  if (!utils.isStringNumber(id)) {
    // username case
    const args = [scriptLstm, '--username', id, '--max-tweets', maxTweets, '--output', `${resultId}`]
    console.log(args)
    python = spawn('python', args, { cwd: currentWorkingWindow });
  } else {
    // conversation id case
    const args = [scriptLstm, '--conversation-id', id, '--max-tweets', maxTweets, '--output', `${resultId}`]
    console.log(args)
    python = spawn('python', args, { cwd: currentWorkingWindow });
  }

  python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    changeStatus(STATUS_READY)
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
  vader,
  lstm,
  STATUS_READY,
  STATUS_BUSY
}
