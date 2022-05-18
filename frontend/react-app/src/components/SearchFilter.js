import { useRef, useState } from 'react'

import moment from 'moment'

import classes from './SearchFilter.module.css'

const FORMAT_TIME = 'YYYY/MM/DD HH:mm'

function SearchFilter(props) {
  const [feedback, setFeedback] = useState('')

  const maxTweetsInputRef = useRef()
  const startTimeInputRef = useRef()
  const endTimeInputRef = useRef()

  function onClickOkHandler(event) {
    event.preventDefault()

    let enteredMaxTweets = maxTweetsInputRef.current.value
    let enteredStartTime = startTimeInputRef.current.value
    let enteredEndTime = endTimeInputRef.current.value

    // validation
    enteredMaxTweets = enteredMaxTweets.trim() === '' ? props.maxTweets : parseInt(enteredMaxTweets)
    if (enteredMaxTweets < 0) {
      setFeedback(`Maximum Tweets must be greater than or equal to zero`)
      maxTweetsInputRef.current.value = ''
      return
    }


    if (enteredStartTime.trim() === '') {
      enteredStartTime = props.startTime
    }
    if (!moment(enteredStartTime, [FORMAT_TIME], true).isValid()) {
      setFeedback(`Start Time must comply with format '${FORMAT_TIME}'`)
      startTimeInputRef.current.value = ''
      return
    }

    if (enteredEndTime.trim() === '') {
      enteredEndTime = props.endTime
    }
    if (!moment(enteredEndTime, [FORMAT_TIME], true).isValid()) {
      setFeedback(`End Time must comply with format '${FORMAT_TIME}'`)
      endTimeInputRef.current.value = ''
      return
    }

    const date1 = moment(enteredStartTime, FORMAT_TIME)
    const date2 = moment(enteredEndTime, FORMAT_TIME)
    const diffTimeInMs = date2.diff(date1)
    console.log(diffTimeInMs)
    if (diffTimeInMs < 0) {
      setFeedback(`The End Time must be greater than the Start Time`)
      return
    }

    props.onReturn({
      maxTweets: enteredMaxTweets,
      startTime: enteredStartTime,
      endTime: enteredEndTime
    })
  }

  function onClickCancelHandler(event) {
    event.preventDefault()
    props.onReturn({ ...props })
  }

  return (
    <div>
      <div className={classes.filter}>
        <h1>Filter</h1>
        <form className={classes.form__filter}>
          <div className={classes.form_control__filter}>
            <label htmlFor="maxTweets">Maximum Tweets</label>
            <input type="number" name="maxTweets" placeholder={props.maxTweets} ref={maxTweetsInputRef} />
          </div>
          <div className={classes.form_control__filter}>
            <label htmlFor="startTime">Start Time</label>
            <input type="datetime" name="startTime" placeholder={props.startTime} ref={startTimeInputRef} />
          </div>
          <div className={classes.form_control__filter}>
            <label htmlFor="endTime">End Time</label>
            <input type="datetime" name="endTime" placeholder={props.endTime} ref={endTimeInputRef} />
          </div>
          {!!feedback && <div className={classes.feedback}>{feedback}</div>}
          <button type="submit" onClick={onClickOkHandler}>OK</button>
          <button type="submit" onClick={onClickCancelHandler}>Cancel</button>
        </form>
      </div>
      <div className={classes.backdrop}></div>
    </div>
  )
}

export default SearchFilter
