from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from .sentimentAnalyser import token_clean, tokenize, train_classifier
import geopandas as gpd
import pandas as pd
import re
from nltk.corpus import stopwords
from shapely.geometry import Point
from dateutil import tz


class Processor:

    def __init__(self):
        self.sentiment_analyser1 = SentimentIntensityAnalyzer()  # sentiment analyser - can be replaced with better
        self.stop_words = stopwords.words('english')
        self.face_list = """:) :-) 8) =) :D :( :-( 8( =( (: (-: (8 (= D: ): )-: )8 )= :p""".split()
        self.face_regex = "|".join(map(re.escape, self.face_list))
        self.sentiment_analyser2 = train_classifier(self.stop_words, self.face_regex)

    # reformat the time so it is in current timezone (AEST)
    def reformat_time(self, time):
        reformattedTime = pd.to_datetime(pd.DataFrame({'date': [time]})['date'])[0]
        # grab local timezone
        CURRENT = tz.tzlocal()
        # convert to local tz
        return str(reformattedTime.astimezone(CURRENT))

    # format the text for processing by the custom sentiment analyser
    def process_text(self, tweet):
        # tokenize
        tweet_tokens = tokenize(tweet, self.face_regex)
        # clean
        tweet_tokens_clean = token_clean(tweet_tokens, self.stop_words)
        return tweet_tokens_clean

    # get the custom sentiment score
    def custom_sentiment(self, processed_tweet):
        # get sentiment score
        # sentiment = self.sentiment_analyser2.classify(dict([token, True] for token in processed_tweet))
        processed_tokens = dict([token, True] for token in processed_tweet)
        prob_pos = self.sentiment_analyser2.prob_classify(processed_tokens).prob('Positive')
        sentiment_score = prob_pos * 2 - 1
        return sentiment_score

    # return a dictionary for a given tweet containing vital features of tweet + location and sentiment
    def process_tweet(self, tweet):
        tweetDict = {}
        tweetDict['city'] = "melbourne"
        tweetDict["sa2Name"] = None
        tweetDict["coord"] = None
        tweetDict["sa2Code"] = None
        tweetDict["_id"] = str(tweet["id"])
        tweetDict["original_text"] = tweet["content"]
        tweetDict["processed_text"] = self.process_text(tweetDict["original_text"])
        tweetDict["time"] = self.reformat_time(tweet["date"])
        tweetDict["sentiment1"] = self.sentiment_analyser1.polarity_scores(tweetDict["original_text"])['compound']
        tweetDict["sentiment2"] = self.custom_sentiment(tweetDict["processed_text"])
        return tweetDict
