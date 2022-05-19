import { TwitterTimelineEmbed, TwitterShareButton, TwitterFollowButton, TwitterHashtagButton, TwitterMentionButton, TwitterTweetEmbed, TwitterMomentShare, TwitterDMButton, TwitterVideoEmbed, TwitterOnAirButton } from 'react-twitter-embed';
import SentimentChart from './SentimentListItem/SentimentChart';
import SentimentChartVertical from './SentimentListItem/SentimentChartVertical';

import classes from './SentimentListItem.module.css'

function SentimentListItem(props) {
  const { conversationId } = props.data
  return (
    <li className={classes.sentiment__item}>
      <h1>Conversation ID <a target="_blank" href={`https://twitter.com/twitter/status/${conversationId}`}>#{conversationId}</a></h1>
      <div className={classes.review}>
        <TwitterTweetEmbed
          tweetId={conversationId}
          options={{'font-size': '14px'}}
        />
      </div>
      <div className={classes.chart}>
        <SentimentChartVertical data={props.data} />
      </div>
    </li>
  )
}

export default SentimentListItem
