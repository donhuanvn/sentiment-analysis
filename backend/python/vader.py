import sys
import time
__start_time = time.time()

import argparse
import random

from utils import *
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()

# a = random.randint(0, 50)
# b = random.randint(0, 50)
# c = 100 - a - b

# fake_data_for_username = {
#     'user_id': '1525550091586506752',
#     'username': 'elonmusk',
#     'analysis_time': '2022/05/22 10:10:09',
#     'sentiment_data': [
#         {
#             "conversation_id": "6269212001270679397",
#             "sentiment_data": {
#                 "positive": c,
#                 "neutral": b,
#                 "negative": a
#             }
#         },
#         {
#             "conversation_id": "0920730480207638670",
#             "sentiment_data": {
#                 "positive": c,
#                 "neutral": b,
#                 "negative": a
#             }
#         }
#     ]
# }


# fake_data_for_conversation_id = {
#     "conversation_id": "6269212001270679397",
#     'analysis_time': '2022/05/22 10:10:09',
#     "sentiment_data": {
#         "positive": c,
#         "neutral": b,
#         "negative": a
#     }
# }


def process_tweets_comments_vader(http_resp):
    data = http_resp.json()
    # print(data)
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


def analyze_sentimental_recent_posts_of_user(username, max_tweets=None, start_time=None, end_time=None):
    print('Analyzing for user %s ...' % (username))
    resp_tw = get_tweets_by_user(username, max_tweets, start_time, end_time)
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
            positive, neutral, negative = process_tweets_comments_vader(resp)
            # print('TWEET: %s \nPOS: %d, NEU: %d, NEG: %d' %
            #       (tweet['text'], positive, neutral, negative))
            positive, neutral, negative = transform_to_percentage(
                positive, neutral, negative)
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
            "processing_time": time.time() - __start_time,
            "analyzer": "vader",
            "sentiment_data": sentimentList
        }

        return result

    return None


def analyze_sentimental_recent_post(conversation_id, max_tweets=None, start_time=None, end_time=None):
    print('Analyzing for conversation_id %s ...' % (conversation_id))
    resp = get_tweet_comments(
        conversation_id, max_tweets, start_time, end_time)
    # print(resp)
    positive, neutral, negative = process_tweets_comments_vader(resp)
    # print('TWEET: %s \nPOS: %d, NEU: %d, NEG: %d' %
    #       (conversation_id, positive, neutral, negative))
    positive, neutral, negative = transform_to_percentage(
        positive, neutral, negative)
    result = {
        "conversation_id": conversation_id,
        "analysis_time": current_time_string(),
        "processing_time": time.time() - __start_time,
        "sentiment_data": {
            "positive": positive,
            "neutral": neutral,
            "negative": negative
        }
    }
    return result


def main():
    parser = argparse.ArgumentParser(add_help=True)
    parser.add_argument('--username', type=str)
    parser.add_argument('--conversation-id', type=str)
    parser.add_argument('--max-tweets', type=int, default=1000)
    parser.add_argument('--start-time', type=str)
    parser.add_argument('--end-time', type=str)
    parser.add_argument('--output', type=str)

    # args.username, args.conversation_id, args.max_tweets, args.output
    args = parser.parse_args()

    if (bool(args.username)):
        result = analyze_sentimental_recent_posts_of_user(
            args.username,
            args.max_tweets,
            args.start_time,
            args.end_time)
        write_result_to_file(args.output, result)

    elif (bool(args.conversation_id)):
        result = analyze_sentimental_recent_post(
            args.conversation_id,
            args.max_tweets,
            args.start_time,
            args.end_time)
        write_result_to_file(args.output, result)

    else:
        print("Must specify --username or --conversation-id")

    None


if __name__ == "__main__":
    sys.exit(main())
