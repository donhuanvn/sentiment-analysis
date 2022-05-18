import sys
import time
import os
import argparse
import json
import random

a = random.randint(0, 50)
b = random.randint(0, 50)
c = 100 - a - b

fake_data_for_username = {
    'user_id': '1525550091586506752',
    'username': 'elonmusk',
    'analysis_time': '2022/05/22 10:10:09',
    'sentiment_data': [
        {
            "conversation_id": "6269212001270679397",
            "sentiment_data": {
                "positive": c,
                "neutral": b,
                "negative": a 
            }
        },
        {
            "conversation_id": "0920730480207638670",
            "sentiment_data": {
                "positive": c,
                "neutral": b,
                "negative": a
            }
        }
    ]
}


fake_data_for_conversation_id = {
    "conversation_id": "6269212001270679397",
    'analysis_time': '2022/05/22 10:10:09',
    "sentiment_data": {
        "positive": c,
        "neutral": b,
        "negative": a
    }
}


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

    time.sleep(5)

    # fake
    filename = os.path.join(os.getcwd(), '..', 'data', '{}.json'.format(args.output))
    if (bool(args.username)):
        with open(filename, 'w') as outfile:
            json.dump(fake_data_for_username, outfile)
    elif (bool(args.conversation_id)):
        with open(filename, 'w') as outfile:
            json.dump(fake_data_for_conversation_id, outfile)
    else:
        print("Must specify --username or --conversation-id")
    None


if __name__ == "__main__":
    sys.exit(main())
