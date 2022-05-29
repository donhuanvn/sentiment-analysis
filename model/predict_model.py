# DataFrame
import pandas as pd
import tensorflow as tf
from tensorflow import keras
# nltk
import nltk
from nltk.corpus import stopwords
from  nltk.stem import SnowballStemmer
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
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

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
w2v_model = gensim.models.word2vec.Word2Vec.load("model.w2v")
tokenizer = pickle.load(open("tokenizer.pkl",'rb'))
model = keras.models.load_model("model.h5")

def remove_hashtag(sentence):
  return re.sub("([@#][A-Za-z0-9_]+)","", sentence)

def preprocess(text, stem=False):
    # Remove link,user and special characters
    text = re.sub(TEXT_CLEANING_RE, ' ', str(text).lower()).strip()
    # Remove hashtag
    text = re.sub("([@#][A-Za-z0-9_]+)","", text)
    # Remove number
    text = re.sub("(\d+)", '', text)
    # Remove punctuation
    punctuation = list(string.punctuation) + ['...',  '``']
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
    x_test = pad_sequences(tokenizer.texts_to_sequences([text]), maxlen=SEQUENCE_LENGTH)
    # Predict
    score = model.predict([x_test])[0]
    # Decode sentiment
    label = decode_sentiment(score, include_neutral=include_neutral)

    return {"label": label, "score": float(score),
       "elapsed_time": time.time()-start_at}

predict("I love the music! ...")