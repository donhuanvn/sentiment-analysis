import classes from './SentimentList.module.css'
import SentimentListItem from './SentimentListItem'

function SentimentList(props) {

  if (!props.listData || props.listData.length <= 0)
    return (
      <div className={classes.no_result}>No sentiment analysis result</div>
    )

  return (
    <ul className={classes.sentiment__list}>
      {
        props.listData.map(result => {
          const key = result.conversationId ? result.conversationId : result.userId
          return <SentimentListItem data={result} key={key}/>
        })
      }
    </ul>
  )
}

export default SentimentList
