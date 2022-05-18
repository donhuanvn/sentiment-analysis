const path = require('path')
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const syncWithClients = require('./sync-with-clients')
const utils = require('./utils')
utils.initializeForFristRun()

const sentimentController = require('./controllers/twitter-sentiment')
const errorController = require('./controllers/error')

const app = express();
const server = http.createServer(app);
syncWithClients.init(server)

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())


app.use(express.static(path.join(__dirname, "..", "frontend", "react-app", "build")));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', sentimentController.getIndex)

app.post('/search', sentimentController.postSearchTerm)

app.get('/history', sentimentController.getHistoryList)

app.get('/history/:resultId', sentimentController.getHistoryData)

app.use(errorController.get404);

server.listen(5000);
