import { useState, useEffect } from 'react'

import HistoryList from './HistoryList'

import classes from './history.module.css'


function History(props) {
  const [listData, setListData] = useState([])
  const origin = new URL(window.location.href).origin

  useEffect(() => {
    fetch('http://localhost:5000/history')
      .then(response => response.json())
      .then(jsonData => {
        setListData(jsonData)
      })
      .catch(err => console.error('Error:', err))
  }, [])

  function onCloseHandler(event) {
    props.onClose(event)
  }

  return (
    <div className={classes.history}>
      <div className={classes.history__header}>
        <h1 className={classes.history__logo}>History</h1>
        <img
          className={classes.history__close__btn}
          src={`${origin}/images/close.png`}
          onClick={onCloseHandler} />
      </div>
      <HistoryList listData={listData} />

    </div>
  )
}

export default History
