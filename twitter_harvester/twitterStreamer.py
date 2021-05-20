import tweepy
import couchDatabase
import time
import requests
import sys
from urllib3.exceptions import ProtocolError
import process


class tweetStreamer(tweepy.StreamListener):

    def __init__(self, city_str, max_time=1000000):
        self.start = time.time()
        self.limit = max_time
        self.city = city_str
        self.ourCouch = couchDatabase.CouchDatabase()
        self.processor = process.Processor(city_str)
        super(tweetStreamer, self).__init__()


    def on_status(self, status):
        # tweet as json file
        tweet = status._json
        # ensure not a retweet
        if not hasattr(status, "retweeted_status"):
            # process tweet and get dict
            tweetDict = self.processor.processTweet(tweet)
            print(tweetDict)
            # add to dict
            self.ourCouch.add_tweet(tweetDict, self.city)

        # check time limit and exit if exceeded
        if (time.time() - self.start) > self.limit:
            print("Time limit reached!")
            return False

    def on_connect(self):
        print("Connected to Twitter API!")

    def on_error(self, status_code):
        if status_code == 420:
            print("rate limit error - sleep, then disconnect awhile!")
            # we must DC for code 420 which means rate limit
            time.sleep(5*60)
            return False


# function to get auth details given text file storing keys
def getAuth(fileLoc):
    # first let's extract the keys from text file store them in variables
    keys = []
    with open(fileLoc, 'r') as f:
        for i in f:
            # assumes the text file containing keys is of form TYPE : KEY VAL
            keys.append(i.split(":")[1].strip())
    consumerKey = keys[0]
    secretKey = keys[1]
    bearerKey = keys[2]
    access = keys[3]
    accessSecret = keys[4]
    return consumerKey, secretKey, bearerKey, access, accessSecret


# get the coordinates for the relevant city for use in twitter streamer filter
def getCityCoords(city_str):
    if city_str == "melbourne":
        MELB = [144.05143, -38.45143, 145.64219, -37.34171]
        return MELB
    elif city_str == "sydney":
        SYD = [150.436268, -34.126157, 151.403528, -33.569185]
        return SYD
    elif city_str == "brisbane":
        BRIS = [152.649805, -27.960568, 153.504633, -26.988025]
        return BRIS
    elif city_str == "perth":
        PER = [115.408955, -31.591256, 116.499348, -32.631133]
        return PER
    elif city_str == "adelaide":
        ADL = [138.241227, -34.537995, 138.934533, -35.299131]
        return ADL
    else:
        print("Invalid city")
        return None


# run the actual streamer continually
def runStreamer(city_str):
    # first authenticate
    consumerKey, secretKey, bearerKey, access, accessSecret = getAuth("./keys_mamarik.txt")  # grab keys
    auth = tweepy.OAuthHandler(consumerKey, secretKey)
    auth.set_access_token(access, accessSecret)
    api = tweepy.API(auth)

    # set up and start streamer
    streamer = tweetStreamer(city_str)
    #tweetStream = tweepy.Stream(auth=api.auth, listener=streamer, wait_on_rate_limit=True, wait_on_rate_limit_notify=True)
    tweetStream = tweepy.Stream(auth=api.auth, listener=streamer)

    while True:
        try:
            # filter by location (i.e. choose a corresponding city) and appropriate language
            tweetStream.filter(locations=getCityCoords(city_str),languages=['en'])
        except (ProtocolError, AttributeError):
            # if error, sleep for 5 mins
            time.sleep(60*5)
            continue


            
# if this script is run from command line as python city
# we want it to run the streamer
if __name__ == '__main__':
    try:
        city = sys.argv[1]
        runStreamer(city)
    except IndexError:
        pass
