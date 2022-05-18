import requests
import json
import datetime

BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAAEt%2FcgEAAAAA%2FgThpZgB8X3Ds%2BJ20r4zjpeBpXI%3DIzrgb0nXRJf5h6Qbneg0z2rS7KLgU6NWQGgJiaqvkuf1zz4x2j'
headers = {"Authorization": "Bearer {}".format(
    BEARER_TOKEN), "content-type": "application/json"}


def get_tweets_by_user(user, max_tweets=None, start_time=None, end_time=None):
    url = 'https://api.twitter.com/2/tweets/search/recent'
    query_data = [('query', 'from:' + user), ('max_results', '10')]
    query_url = url + '?' + \
        '&'.join([str(t[0]) + '=' + str(t[1]) for t in query_data])
    response = requests.get(query_url, headers=headers, stream=True)
    #print(query_url, response)

    return response


def get_tweet_comments(id='1526022409383460866', max_tweets=None, start_time=None, end_time=None):
    url = 'https://api.twitter.com/2/tweets/search/recent'
    #url = 'https://api.twitter.com/2/tweets/search/all'
    query_data = [('query', 'conversation_id:' + id), ('max_results', '10'),
                  ('tweet.fields', 'conversation_id,in_reply_to_user_id,created_at')]
    query_url = url + '?' + \
        '&'.join([str(t[0]) + '=' + str(t[1]) for t in query_data])
    response = requests.get(query_url, headers=headers, stream=True)
    #print(query_url, response)

    return response


def writeResultToFile(filename, result):
    with open(filename, 'w') as outfile:
        json.dump(result, outfile)

def current_time_string():
    return datetime.datetime.now().strftime("%Y/%m/%d %H:%M:%S")
