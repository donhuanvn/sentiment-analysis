const path = require('path')
const fs = require('fs')
const utils = require('../utils')

const LIMIT = 5

const HISTORY_FILE = path.join(__dirname, '..', 'data', 'history.json')
const DATA_DIR = path.join(__dirname, '..', 'data')

const push = (resultId) => {
  let content = fs.readFileSync(path.join(DATA_DIR, `${resultId}.json`))
  const data = JSON.parse(content)

  const username = data['username'] ? data['username'] : ''
  const conversationId = data['conversation_id'] ? data['conversation_id'] : ''

  const historyData = {
    resultId,
    username,
    conversationId,
    analysisTime: data['analysis_time'],
    timestamp: new Date().getTime()
  }

  content = fs.readFileSync(HISTORY_FILE)
  const history = JSON.parse(content)

  history.push(historyData)
  history.sort((a, b) => (b.timestamp - a.timestamp))

  // remove the oldest result if the history list reaches its length limit 
  if (history.length > LIMIT) {
    const deletedHistoryData = history.pop()
    fs.unlinkSync(path.join(DATA_DIR, `${deletedHistoryData.resultId}.json`))
  }

  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 4), { encoding: 'utf-8' })
}

const readList = () => {
  let content = fs.readFileSync(HISTORY_FILE)
  const history = JSON.parse(content)

  const transformedHistory = history.map(item => {
    if (item.username)
      return {
        resultId: item.resultId,
        username: item.username,
        analysisTime: item.analysisTime,
        timestamp: item.timestamp
      }
    else
      return {
        resultId: item.resultId,
        conversationId: item.conversationId,
        analysisTime: item.analysisTime,
        timestamp: item.timestamp
      }
  })

  return transformedHistory
}

const getHistoryData = (resultId) => {
  try {
    let content = fs.readFileSync(path.join(DATA_DIR, `${resultId}.json`))
    const data = JSON.parse(content)

    if (data.username)
      return data.sentiment_data.map(item => ({
        conversationId: item.conversation_id,
        sentimentData: { ...item.sentiment_data }
      }))
    else
      return [{
        conversationId: data.conversation_id,
        sentimentData: { ...data.sentiment_data }
      }]

  } catch (error) {
    console.log(error)
    return null
  }
}

module.exports = {
  push,
  readList,
  getHistoryData
}

