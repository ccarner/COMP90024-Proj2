from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from .sentimentAnalyser import token_clean, tokenize, train_classifier
import geopandas as gpd
import pandas as pd
import re
from nltk.corpus import stopwords
from shapely.geometry import Point
from dateutil import tz


# create dictionaries given a shapefile as a GP df and column names
def create_dictionaries(shapeFile, codeCol, nameCol, geomCol):
    DF = gpd.read_file(shapeFile)
    geom = pd.Series(DF[geomCol].values, index=DF[codeCol]).to_dict()
    names = pd.Series(DF[nameCol].values, index=DF[codeCol]).to_dict()
    return geom, names


# given the city name, use the corresponding shape file to assign geometry and name dict (name and geom of sa2)
# we will probably only use the melbourne one since we dont care about sa2 for other cities
# included here for completeness
def assign_shape_file(city_str):
    if city_str == "melbourne":
        # set up shape files for processing tweets
        shapeFile = "shp-pop/MELB/118d4d92-477a-4763-b824-3d34ff04720d.shp"
        geomDict, namesDict = create_dictionaries(shapeFile, "sa2_mainc0", "sa2_name", "geometry")
        return geomDict, namesDict
    elif city_str == "sydney":
        # set up shape files for processing tweets
        shapeFile = "shp-pop/SYD/11f5c712-2791-4ff4-b6cc-755ca3b6cb88.shp"
        geomDict, namesDict = create_dictionaries(shapeFile, "sa2_mainc0", "sa2_name", "geometry")
        return geomDict, namesDict
    elif city_str == "brisbane":
        # set up shape files for processing tweets
        shapeFile = "shp-pop/BRIS/225e1af6-0673-4c08-8b22-0a50d2734088.shp"
        geomDict, namesDict = create_dictionaries(shapeFile, "sa2_mainc0", "sa2_name", "geometry")
        return geomDict, namesDict
    elif city_str == "perth":
        # set up shape files for processing tweets
        shapeFile = "shp-pop/PER/92b7725b-0803-4b2e-8554-d6943db3b21e.shp"
        geomDict, namesDict = create_dictionaries(shapeFile, "sa2_mainc0", "sa2_name", "geometry")
        return geomDict, namesDict
    elif city_str == "adelaide":
        # set up shape files for processing tweets
        shapeFile = "shp-pop/ADL/2fdb22a2-164b-4c67-b002-0e6673ad5f81.shp"
        geomDict, namesDict = create_dictionaries(shapeFile, "sa2_mainc0", "sa2_name", "geometry")
        return geomDict, namesDict
    else:
        print("Invalid city")
        return None


class Processor:

    def __init__(self, city_str):
        self.city = city_str
        self.sentiment_analyser1 = SentimentIntensityAnalyzer()  # sentiment analyser - can be replaced with better
        self.geomDict, self.namesDict = assign_shape_file(city_str)
        # variables for tweet text processing & custom sentiment analyser
        self.stop_words = stopwords.words('english')
        self.face_list = """:) :-) 8) =) :D :( :-( 8( =( (: (-: (8 (= D: ): )-: )8 )= :p""".split()
        self.face_regex = "|".join(map(re.escape, self.face_list))
        self.sentiment_analyser2 = train_classifier(self.stop_words, self.face_regex)

    # return the sa2 (suburb) code and name if coordinates fall into an sa2, or none otherwise
    def suburb_location(self, coords):
        for i in self.geomDict:
            poly = self.geomDict[i]
            coordsAsPoint = Point(coords)
            if poly.contains(coordsAsPoint):
                return i
        return None

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
        tweetDict['city'] = self.city
        if tweet['coordinates'] is not None:
            coords = tweet["coordinates"]["coordinates"]
            sa2 = self.suburb_location(coords)
        else:
            coords = None
            sa2 = None
        tweetDict["_id"] = tweet["id_str"]
        tweetDict["coord"] = coords
        tweetDict["original_text"] = tweet["text"]
        tweetDict["processed_text"] = self.process_text(tweetDict["original_text"])
        tweetDict["time"] = self.reformat_time(tweet["created_at"])
        tweetDict["sentiment1"] = self.sentiment_analyser1.polarity_scores(tweetDict["original_text"])['compound']
        tweetDict["sentiment2"] = self.custom_sentiment(tweetDict["processed_text"])
        tweetDict["sa2Code"] = sa2
        if sa2 is not None:
            tweetDict["sa2Name"] = self.namesDict[sa2]
        else:
            tweetDict["sa2Name"] = None
        return tweetDict
