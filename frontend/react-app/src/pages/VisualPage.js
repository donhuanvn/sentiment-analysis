import { useRef, useState, useEffect } from 'react'
import { useParams } from "react-router-dom";

import History from '../components/history'
import SentimentList from '../components/SentimentList'

import classes from './VisualPage.module.css'

function VisualPage(props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [listData, setListData] = useState([])
  const [maxTweets, setMaxTweets] = useState(1000)

  const searchInputRef = useRef()

  let { resultId } = useParams();

  useEffect(() => {
    fetch(`http://localhost:5000/history/${resultId}`)
      .then(response => {
        if (response.status === 204) {
          return setListData([])
        }
        response.json()
          .then(jsonData => {
            setListData(jsonData)
          })
      })
      .catch(err => console.error('Error:', err))
  }, [resultId])

  function submitHandler(event) {
    event.preventDefault()

    const enteredSearch = searchInputRef.current.value
    if (enteredSearch.trim().length === 0)
      return

    setIsSubmitting(true)
    setShowHistory(false)

    fetch('http://localhost:5000/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ searchTerm: enteredSearch, maxTweets })
    })
      .then(data => {
        console.log('Success:', data)
        // the server has accepted search request.
        setTimeout(() => { setIsSubmitting(false) }, 1000)
      })
      .catch(err => {
        console.error('Error:', err)
        setIsSubmitting(false)
      })
  }

  function onClickBtnHistoryHandler(event) {
    event.preventDefault()

    setShowNotification(false)

    if (showHistory) {
      setShowHistory(false)
    } else {
      setShowHistory(true)
    }
  }

  return (
    <div>
      <header>
        <form onSubmit={submitHandler} className={classes.form__url}>
          <h1 className={classes.logo}>
            <a href="../index.html">Sentiment Analysis</a>
          </h1>
          <div className={classes.input__url}>
            <img src="../images/user.png" alt="user icon" />
            <input type="text" name="user" id="user" ref={searchInputRef} />
            <img src="../images/edit.png" alt="edit icon" className={classes.img__edit} />
          </div>
          <div className={classes.buttons}>
            <button type="submit" className={classes.button} disabled={isSubmitting}>Analysis</button>
            <button className={classes.button} onClick={onClickBtnHistoryHandler}>History</button>
          </div>
        </form>
      </header>
      <main>
        {
          showNotification &&
          <div className={classes.notification}>
            Analysis process is completed! Please press History and then navigate to the result.
          </div>
        }
        <SentimentList listData={listData} />
      </main>
      {showHistory && <History onClose={onClickBtnHistoryHandler} />}
    </div>
  )
}

export default VisualPage
