import Conversation from './SentimentListItem/Conversation';
import User from './SentimentListItem/User';

import classes from './SentimentListItem.module.css'

function SentimentListItem(props) {

  let visualization

  if (props.data.type === 'conversation') {
    visualization = <Conversation data={props.data}/>
  } else {
    visualization = <User data={props.data} />
  }

  return (
    <li className={classes.sentiment__item}>
      {visualization}
    </li>
  )
}

export default SentimentListItem
