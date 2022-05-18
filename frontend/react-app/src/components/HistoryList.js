import HistoryListItem from './HistoryListItem'

import classes from './HistoryList.module.css'

function HistoryList(props) {

  if (!props.listData || props.listData.length <= 0) 
    return <div>No history</div>

  return (
    <ul className={classes.history__list}>
      {
        props.listData.map(item => {
          const key = item.resultId
          return <HistoryListItem data={item} key={key}/>
        })
      }
    </ul>
  )
}

export default HistoryList
