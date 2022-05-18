
import requests

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import enum

class Method(enum.Enum):
   Vader = 1
   LSTM = 2

ACCESS_TOKEN = ''
ACCESS_SECRET = ''
CONSUMER_KEY = ''
CONSUMER_SECRET = ''
BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAAEt%2FcgEAAAAA%2FgThpZgB8X3Ds%2BJ20r4zjpeBpXI%3DIzrgb0nXRJf5h6Qbneg0z2rS7KLgU6NWQGgJiaqvkuf1zz4x2j'

headers = {"Authorization": "Bearer {}".format(
    BEARER_TOKEN), "content-type": "application/json"}


def get_tweets():
    url = 'https://api.twitter.com/2/tweets/1228393702244134912'
    query_data = [('tweet.fields', 'created_at,attachments'),
                  ('expansions', 'author_id')]
    query_url = url + '?' + \
        '&'.join([str(t[0]) + '=' + str(t[1]) for t in query_data])
    response = requests.get(query_url, headers=headers, stream=True)
    print(query_url, response)

    return response


def get_tweets_by_user(user):
    url = 'https://api.twitter.com/2/tweets/search/recent'
    query_data = [('query', 'from:' + user), ('max_results', '10')]
    query_url = url + '?' + \
        '&'.join([str(t[0]) + '=' + str(t[1]) for t in query_data])
    response = requests.get(query_url, headers=headers, stream=True)
    #print(query_url, response)

    return response


def get_tweet_comments(id='1526022409383460866'):
    url = 'https://api.twitter.com/2/tweets/search/recent'
    #url = 'https://api.twitter.com/2/tweets/search/all'
    query_data = [('query', 'conversation_id:' + id), ('max_results', '10'),
                  ('tweet.fields', 'conversation_id,in_reply_to_user_id,created_at')]
    query_url = url + '?' + \
        '&'.join([str(t[0]) + '=' + str(t[1]) for t in query_data])
    response = requests.get(query_url, headers=headers, stream=True)
    #print(query_url, response)

    return response


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
                sentiment = "POSITIVE"
                positive += 1
            elif sentiment_score <= -0.05:
                sentiment = "NEGATIVE"
                negative += 1
            else:
                sentiment = "NEUTRAL"
                neutral += 1

            # separate sentiment label with tweet content
            mess = sentiment + '||||' + tweet_text + '\n'
            # print(mess)
            #tcp_connection.send(bytes(mess, 'utf-8'))
    return (positive, neutral, negative)


# DataFrame
import pandas as pd
import tensorflow as tf
from tensorflow import keras
# nltk
import nltk
from nltk.corpus import stopwords
from nltk.stem import SnowballStemmer
# Keras
from keras.preprocessing.sequence import pad_sequences
# Word2vec
import gensim
# Utility
import re
import logging
import time
import pickle
import string
# Set log
logging.basicConfig(
    format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

# TEXT CLEANING
TEXT_CLEANING_RE = "@\S+|https?:\S+|http?:\S|[^A-Za-z0-9]+"
POSITIVE = "POSITIVE"
NEGATIVE = "NEGATIVE"
NEUTRAL = "NEUTRAL"
SENTIMENT_THRESHOLDS = (0.4, 0.7)
SEQUENCE_LENGTH = 300
# EXPORT FILE
KERAS_MODEL = "model.h5"
WORD2VEC_MODEL = "model.w2v"
TOKENIZER_MODEL = "tokenizer.pkl"

nltk.download('stopwords')
stop_words = stopwords.words("english")
stemmer = SnowballStemmer("english")
w2v_model = gensim.models.word2vec.Word2Vec.load("./model.w2v")
tokenizer = pickle.load(open('./tokenizer.pkl', 'rb'))
model = keras.models.load_model("./model.h5")


def remove_hashtag(sentence):
    return re.sub("([@#][A-Za-z0-9_]+)", "", sentence)


def preprocess(text, stem=False):
    # Remove link,user and special characters
    text = re.sub(TEXT_CLEANING_RE, ' ', str(text).lower()).strip()
    # Remove hashtag
    text = re.sub("([@#][A-Za-z0-9_]+)", "", text)
    # Remove number
    text = re.sub("(\d+)", '', text)
    # Remove punctuation
    punctuation = list(string.punctuation) + ['...', '``']
    tokens = []
    for token in text.split():
        if (token not in stop_words) and (token not in punctuation):
            if stem:
                tokens.append(stemmer.stem(token))
            else:
                tokens.append(token)
    return " ".join(tokens)


def decode_sentiment(score, include_neutral=True):
    if include_neutral:
        label = NEUTRAL
        if score <= SENTIMENT_THRESHOLDS[0]:
            label = NEGATIVE
        elif score >= SENTIMENT_THRESHOLDS[1]:
            label = POSITIVE

        return label
    else:
        return NEGATIVE if score < 0.5 else POSITIVE


def predict(text, include_neutral=True):
    start_at = time.time()
    # Prepocess
    text = preprocess(text)
    # Tokenize text
    x_test = pad_sequences(tokenizer.texts_to_sequences(
        [text]), maxlen=SEQUENCE_LENGTH)
    # Predict
    score = model.predict([x_test])[0]
    # Decode sentiment
    label = decode_sentiment(score, include_neutral=include_neutral)

    return {"label": label, "score": float(score),
            "elapsed_time": time.time() - start_at}


def process_tweets_comments_lstm(http_resp):
    data = http_resp.json()
    negative = 0
    neutral = 0
    positive = 0
    if 'data' in data:
        for comment in data['data']:
            tweet_text = str(comment['text'].encode("utf-8"))

            # analysis sentiment score
            label = predict(tweet_text)['label']
            if label == "POSITIVE":
                positive += 1
            elif label == "NEGATIVE":
                negative += 1
            else:
                neutral += 1
            mess = label + '||||' + tweet_text + '\n'
            # print(mess)
    return (positive, neutral, negative)


def analyze_sentimental_recent_post_of_user(username, method=Method.Vader):
    print('Analyzing for user %s ...' % (username))
    resp_tw = get_tweets_by_user(username)
    data = resp_tw.json()
    print(data)
    positive = 0
    neutral = 0
    negative = 0
    if 'data' in data:
        for tweet in data['data']:
            # print(tweet['id'])
            resp = get_tweet_comments(tweet['id'])
            # print(resp)
            if method == Method.Vader:
                positive, neutral, negative = process_tweets_comments_vader(
                    resp)
            else:
                positive, neutral, negative = process_tweets_comments_lstm(
                    resp)
            print('TWEET: %s \nPOS: %d, NEU: %d, NEG: %d' %
                  (tweet['text'], positive, neutral, negative))


analyze_sentimental_recent_post_of_user('POTUS', Method.Vader)
analyze_sentimental_recent_post_of_user('POTUS', Method.LSTM)
predict("@POTUS Your a racist POS SWAMP RAT")
