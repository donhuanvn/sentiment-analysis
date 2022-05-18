import { useRef, useState, useEffect } from 'react'

import History from '../components/history'
import SearchFilter from '../components/SearchFilter'
import StatusBar from '../components/StatusBar'

import classes from './SearchPage.module.css'

import moment from 'moment'

const FORMAT_TIME = 'YYYY/MM/DD HH:mm'

function SearchPage(props) {
  const [showFilter, setShowFilter] = useState(true)
  const [showHistory, setShowHistory] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [maxTweets, setMaxTweets] = useState(1000)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const searchInputRef = useRef()

  useEffect(() => {
    const startTime = moment().subtract(moment.duration(7, 'days')).format(FORMAT_TIME)
    setStartTime(startTime)
    const endTime = moment().format(FORMAT_TIME)
    setEndTime(endTime)
  }, [])

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

  function onClickBtnFilterHandler(event) {
    event.preventDefault()
    setShowFilter(true)
  }

  function onReturnFilterHandler(filter) {
    setShowFilter(false)

    setMaxTweets(filter.maxTweets)
    setStartTime(filter.startTime)
    setEndTime(filter.endTime)
  }

  return (
    <section>
      <h1 className={classes.logo}>Sentiment Analysis</h1>
      <form onSubmit={submitHandler}>
        <div>
          <div className={classes.input__url}>
            <img src='images/user.png' alt='user icon' />
            <input type="text" name="user" id="user" ref={searchInputRef} />
            <img src="images/edit.png" alt="edit icon" className={classes.img__edit} onClick={onClickBtnFilterHandler} />
          </div>
        </div>
        <div>
          <button type="submit" className={classes.button} disabled={isSubmitting}>Analysis</button>
          <button className={classes.button} onClick={onClickBtnHistoryHandler}>History</button>
        </div>
      </form>
      {
        showNotification &&
        <div className={classes.notification}>
          Analysis process is completed! Please press History and then navigate to the result.
        </div>
      }
      <StatusBar isLoading={true} />
      {showFilter && <SearchFilter onReturn={onReturnFilterHandler} maxTweets={maxTweets} startTime={startTime} endTime={endTime} />}
      {showHistory && <History onClose={onClickBtnHistoryHandler} />}
    </section>
  )
}

export default SearchPage
