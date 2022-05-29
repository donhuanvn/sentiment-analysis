import time
start_time = time.time()

from utils import *
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()


def process_tweets_comments_vader(http_resp):
    data = http_resp.json()
    negative = 0
    neutral = 0
    positive = 0
    if 'data' in data:
        for comment in data['data']:
            tweet_text = str(comment['text'].encode("utf-8"))

            # analysis sentiment score
            sentiment_score = analyzer.polarity_scores(tweet_text)["compound"]
            if sentiment_score >= 0.05:
                positive += 1
            elif sentiment_score <= -0.05:
                negative += 1
            else:
                neutral += 1

    return (positive, neutral, negative)


def analyze_sentimental_recent_post_of_user(username, max_tweets=None, start_time=None, end_time=None):
    print('Analyzing for user %s ...' % (username))
    resp_tw = get_tweets_by_user(username)
    data = resp_tw.json()
    # print(data)
    positive = 0
    neutral = 0
    negative = 0
    
    sentimentList = []
    if 'data' in data:
        for tweet in data['data']:
            # print(tweet['id'])
            resp = get_tweet_comments(tweet['id'])
            # print(resp)
            positive, neutral, negative = process_tweets_comments_vader(
                resp)
            # print('TWEET: %s \nPOS: %d, NEU: %d, NEG: %d' %
            #       (tweet['text'], positive, neutral, negative))
            sentimentData = {
                "conversation_id": tweet['id'],
                "sentiment_data": {
                    "positive": positive,
                    "neutral": neutral,
                    "negative": negative
                }
            }
            sentimentList.append(sentimentData)

        result = {
            "username": username,
            "analysis_time": current_time_string(),
            "sentiment_data": sentimentList
        }

        return result
    
    return None


result = analyze_sentimental_recent_post_of_user('elonmusk')
import json
print(json.dumps(result))
print("--- %s seconds ---" % (time.time() - start_time))
