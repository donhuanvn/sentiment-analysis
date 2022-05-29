const fs = require('fs')
const path = require('path')
const crypto = require("crypto")

const HISTORY_FILE = path.join(__dirname, 'data', 'history.json')
const DATA_DIR = path.join(__dirname, 'data')

exports.isStringNumber = (s) => {
  return !isNaN(s)
}

exports.generateResultId = () => {
  return crypto.randomBytes(20).toString("hex")
}

exports.initializeForFristRun = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(HISTORY_FILE)) {
    fs.writeFileSync(HISTORY_FILE, '[]', { encoding: 'utf-8' })
  }
}
