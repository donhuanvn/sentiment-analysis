const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process');

const utils = require('../utils')
const syncWithClients = require('../sync-with-clients')

const DATA_DIR = path.join(__dirname, '..', 'data')

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
  const { maxTweets, startTime, endTime } = filter

  let args
  if (!utils.isStringNumber(id)) {
    // username case
    args = [scriptVader,
      '--username', id,
      '--max-tweets', maxTweets,
      '--start-time', startTime,
      '--end-time', endTime,
      '--output', `${resultId}`]
  } else {
    // conversation id case
    args = [scriptVader,
      '--conversation-id', id,
      '--max-tweets', maxTweets,
      '--start-time', startTime,
      '--end-time', endTime,
      '--output', `${resultId}`]
  }
  console.log(args)
  const stdoutFile = fs.openSync(path.join(DATA_DIR, 'varder.stdout.txt'), 'w');
  const python = spawn('python', args, { cwd: currentWorkingWindow, stdio: [process.stdin, stdoutFile, process.stderr] });

  python.on('close', (code) => {
    fs.closeSync(stdoutFile)
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
  const { maxTweets, startTime, endTime } = filter

  let args
  if (!utils.isStringNumber(id)) {
    // username case
    args = [scriptLstm,
      '--username', id,
      '--max-tweets', maxTweets,
      '--start-time', startTime,
      '--end-time', endTime,
      '--output', `${resultId}`]
  } else {
    // conversation id case
    args = [scriptLstm,
      '--conversation-id', id,
      '--max-tweets', maxTweets,
      '--start-time', startTime,
      '--end-time', endTime,
      '--output', `${resultId}`]
  }
  console.log(args)
  const stdoutFile = fs.openSync(path.join(DATA_DIR, 'lstm.stdout.txt'), 'w');
  const python = spawn('python', args, { cwd: currentWorkingWindow, stdio: [process.stdin, stdoutFile, process.stderr] });

  python.on('close', (code) => {
    fs.closeSync(stdoutFile)
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
