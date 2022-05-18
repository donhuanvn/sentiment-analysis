const Analysis = require('../models/analysis')
const History = require('../models/history')

exports.getIndex = (req, res, next) => {
  res.setHeader("Content-Type", "text/html")
  res.sendFile(path.join(__dirname, "..", "..", "frontend", "react-app", "build", "index.html"));
}

exports.postSearchTerm = (req, res, next) => {
  const { searchTerm, maxTweets, startTime, endTime, analyzer } = req.body

  if (Analysis.getStatus() === 'ready') {
    if (analyzer === 'vader') {
      Analysis.vader(searchTerm, { maxTweets, startTime, endTime }, (resultId) => {
        if (resultId !== '')
          History.push(resultId)
      })
    }
    
    return res.status(200).end()
  }

  res.status(409).end() // conflict
}

exports.getHistoryList = (req, res, next) => {
  const history = History.readList()
  res.json(history)
}

exports.getHistoryData = (req, res, next) => {
  const { resultId } = req.params
  const historyData = History.getHistoryData(resultId)
  if (!historyData)
    return res.status(204).json({
      message: `No any sentiment analysis result with result id '${resultId}'`
    })

  return res.json(historyData)
}
