import { useHistory } from 'react-router-dom'

import classes from './HistoryListItem.module.css'

function HistoryListItem(props) {
  const history = useHistory()

  function clickItemHandler(event) {
    event.preventDefault()
    const resultId = props.data.resultId
    history.push(`/history/${resultId}`)
  }

  if (props.data.username)
    return (
      <li className={classes.history__item}>
        <a href='#' onClick={clickItemHandler}>
          <h3>Twitter User</h3>
          <div>
            <span>Username: </span>
            <span>{props.data.username}</span>
          </div>
          <div>
            <span>Analysis Time: </span>
            <span>{props.data.analysisTime}</span>
          </div>
          <div>
            <span>Processing Time: </span>
            <span>{Math.round(props.data.processingTime) + ' seconds'}</span>
          </div>
          <div>
            <span>Analyzer: </span>
            <span>{props.data.analyzer.toUpperCase()}</span>
          </div>
        </a>
      </li>
    )

  return (
    <li className={classes.history__item}>
      <a href='#' onClick={clickItemHandler}>
        <h3>Twitter Conversation</h3>
        <div>
          <span>Conversation ID: </span>
          <span>{props.data.conversationId}</span>
        </div>
        <div>
          <span>Analysis Time: </span>
          <span>{props.data.analysisTime}</span>
        </div>
        <div>
          <span>Processing Time: </span>
          <span>{props.data.processingTime}</span>
        </div>
        <div>
          <span>Analyzer: </span>
          <span>{props.data.analyzer}</span>
        </div>
      </a>
    </li>
  )

}

export default HistoryListItem
