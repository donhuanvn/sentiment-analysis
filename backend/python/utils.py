import requests
import json
import datetime
import os

BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAAEt%2FcgEAAAAA%2FgThpZgB8X3Ds%2BJ20r4zjpeBpXI%3DIzrgb0nXRJf5h6Qbneg0z2rS7KLgU6NWQGgJiaqvkuf1zz4x2j'
headers = {"Authorization": "Bearer {}".format(
    BEARER_TOKEN), "content-type": "application/json"}

DATA_DIR = os.path.join(os.getcwd(), '..', 'data')


def get_tweets_by_user(user, max_tweets=10, start_time=None, end_time=None):
    url = 'https://api.twitter.com/2/tweets/search/recent'
    query_data = [('query', 'from:' + user + " -is:retweet -is:reply"), ('max_results', str(max_tweets))]
    query_url = url + '?' + \
        '&'.join([str(t[0]) + '=' + str(t[1]) for t in query_data])
    response = requests.get(query_url, headers=headers, stream=True)
    #print(query_url, response)

    return response


def get_tweet_comments(id, max_tweets=100, start_time=None, end_time=None):
    url = 'https://api.twitter.com/2/tweets/search/recent'
    #url = 'https://api.twitter.com/2/tweets/search/all'
    query_data = [('query', 'conversation_id:' + id), ('max_results', '100'),
                  ('tweet.fields', 'conversation_id,in_reply_to_user_id,created_at')]
    query_url = url + '?' + \
        '&'.join([str(t[0]) + '=' + str(t[1]) for t in query_data])
    response = requests.get(query_url, headers=headers, stream=True)
    # print(query_url, response)

    return response


def current_time_string():
    return datetime.datetime.now().strftime("%Y/%m/%d %H:%M:%S")


def write_result_to_file(output_filename, result):
    if (not os.path.exists(DATA_DIR)):
        os.makedirs(DATA_DIR)

    filename = os.path.join(DATA_DIR, '{}.json'.format(output_filename))
    with open(filename, 'w') as outfile:
        json.dump(result, outfile, indent=2, sort_keys=True)


def transform_to_percentage(pos, neu, neg):
    total = pos + neu + neg
    if (total > 0):
        return pos / total * 100, neu / total * 100, neg / total * 100
    else:
        return 0, 0, 0
