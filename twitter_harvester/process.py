from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import geopandas as gpd
import pandas as pd
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon
import numpy as np
from datetime import datetime
from dateutil import tz
import time


# create dictionaries given a shapefile as a GP df and column names
def createDictionaries(shapeFile, codeCol, nameCol, geomCol):
    DF = gpd.read_file(shapeFile)
    geom = pd.Series(DF[geomCol].values, index=DF[codeCol]).to_dict()
    names = pd.Series(DF[nameCol].values, index=DF[codeCol]).to_dict()
    return geom, names


# given the city name, use the corresponding shape file to assign geometry and name dict (name and geom of sa2)
def assignShapeFile(city_str):
    if city_str == "MELB":
        # set up shape files for processing tweets
        shapeFile = "shp-pop/MELB/118d4d92-477a-4763-b824-3d34ff04720d.shp"
        geomDict, namesDict = createDictionaries(shapeFile, "sa2_mainc0", "sa2_name", "geometry")
        return geomDict, namesDict
    elif city_str == "SYD":
        # set up shape files for processing tweets
        shapeFile = "shp-pop/SYD/11f5c712-2791-4ff4-b6cc-755ca3b6cb88.shp"
        geomDict, namesDict = createDictionaries(shapeFile, "sa2_mainc0", "sa2_name", "geometry")
        return geomDict, namesDict
    elif city_str == "BRIS":
        # set up shape files for processing tweets
        shapeFile = "shp-pop/BRIS/225e1af6-0673-4c08-8b22-0a50d2734088.shp"
        geomDict, namesDict = createDictionaries(shapeFile, "sa2_mainc0", "sa2_name", "geometry")
        return geomDict, namesDict
    elif city_str == "PER":
        # set up shape files for processing tweets
        shapeFile = "shp-pop/PER/92b7725b-0803-4b2e-8554-d6943db3b21e.shp"
        geomDict, namesDict = createDictionaries(shapeFile, "sa2_mainc0", "sa2_name", "geometry")
        return geomDict, namesDict
    elif city_str == "ADL":
        # set up shape files for processing tweets
        shapeFile = "shp-pop/ADL/2fdb22a2-164b-4c67-b002-0e6673ad5f81.shp"
        geomDict, namesDict = createDictionaries(shapeFile, "sa2_mainc0", "sa2_name", "geometry")
        return geomDict, namesDict
    elif city_str == "CAN":
        # set up shape files for processing tweets
        shapeFile = "shp-pop/CAN/e288c897-af42-4156-8393-ddd357c6f152.shp"
        geomDict, namesDict = createDictionaries(shapeFile, "sa2_mainc0", "sa2_name", "geometry")
        return geomDict, namesDict
    elif city_str == "DAR":
        # set up shape files for processing tweets
        shapeFile = "shp-pop/DAR/3691c5a8-84d3-4706-8e2e-4af9137d3eed.shp"
        geomDict, namesDict = createDictionaries(shapeFile, "sa2_mainc0", "sa2_name", "geometry")
        return geomDict, namesDict
    elif city_str == "HOB":
        # set up shape files for processing tweets
        shapeFile = "shp-pop/HOB/a47e5c69-2fd1-442a-bb1a-b7bb4831c920.shp"
        geomDict, namesDict = createDictionaries(shapeFile, "sa2_mainc0", "sa2_name", "geometry")
        return geomDict, namesDict
    else:
        print("Invalid city")
        return None


class Processor:

    def __init__(self, city_str):
        self.city = city_str
        self.sentiment_analyser = SentimentIntensityAnalyzer()      # sentiment analyser - can be replaced with better
        self.geomDict, self.namesDict = assignShapeFile(city_str)

    # return the sa2 (suburb) code and name if coordinates fall into an sa2, or none otherwise
    def returnSa2Loc(self, coords):
        for i in self.geomDict:
            poly = self.geomDict[i]
            coordsAsPoint = Point(coords)
            if poly.contains(coordsAsPoint):
                return i
        return None

    # reformat the time so it is in current timezone (AEST)
    def reformatTime(self, time):
        reformattedTime = pd.to_datetime(pd.DataFrame({'date': [time]})['date'])[0]
        # grab local timezone
        CURRENT = tz.tzlocal()
        # convert to local tz
        return str(reformattedTime.astimezone(CURRENT))

    # return a dictionary for a given tweet containing vital features of tweet + location and sentiment
    def processTweet(self, tweet):
        tweetDict = {}
        tweetDict['city'] = self.city
        if tweet['coordinates'] is not None:
            coords = tweet["coordinates"]["coordinates"]
            sa2 = self.returnSa2Loc(coords)
        else:
            coords = None
            sa2 = None
        tweetDict["_id"] = tweet["id_str"]
        tweetDict["coord"] = coords
        tweetDict["text"] = tweet["text"]
        tweetDict["time"] = self.reformatTime(tweet["created_at"])
        tweetDict["sentiment"] = self.sentiment_analyser.polarity_scores(tweetDict["text"])['compound']
        tweetDict["sa2Code"] = sa2
        if coords is not None:
            tweetDict["sa2Name"] = self.namesDict[sa2]
        else:
            tweetDict["sa2Name"] = None
        return tweetDict
