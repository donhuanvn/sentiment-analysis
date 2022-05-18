import time
start_time = time.time()

from utils import *
from tensorflow import keras
# nltk
from nltk.corpus import stopwords
from nltk.stem import SnowballStemmer
# Keras
from keras.preprocessing.sequence import pad_sequences
# Word2vec
import gensim
# Utility
import re
import pickle
import string
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

stop_words = stopwords.words("english")
stemmer = SnowballStemmer("english")
w2v_model = gensim.models.word2vec.Word2Vec.load("./model.w2v")
tokenizer = pickle.load(open('./tokenizer.pkl', 'rb'))
model = keras.models.load_model("./model.h5")

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

    return (positive, neutral, negative)


def analyze_sentimental_recent_post_of_user(username):
    print('Analyzing for user %s ...' % (username))
    resp_tw = get_tweets_by_user(username)
    data = resp_tw.json()
    # print(data)
    positive = 0
    neutral = 0
    negative = 0
    if 'data' in data:
        for tweet in data['data']:
            # print(tweet['id'])
            resp = get_tweet_comments(tweet['id'])

            positive, neutral, negative = process_tweets_comments_lstm(
                resp)
            # print('TWEET: %s \nPOS: %d, NEU: %d, NEG: %d' %
            #       (tweet['text'], positive, neutral, negative)

analyze_sentimental_recent_post_of_user('POTUS')
print("--- %s seconds ---" % (time.time() - start_time))
