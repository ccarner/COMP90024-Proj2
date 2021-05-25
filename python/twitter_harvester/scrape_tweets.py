import snscrape.modules.twitter as sntwitter
import csv
import os
import json
import requests
import couchDatabase
import process_snscrape


def main():
    # harvest tweets using snscrape and save them in json files
    os.system(
        "snscrape --jsonl --max-results 10000 --since 2020-01-01 twitter-search \"lang:en near:\"Melbourne\" within:50km until:2020-01-31\" > melb_tweets_JAN.json")
    os.system(
        "snscrape --jsonl --max-results 10000 --since 2020-02-01 twitter-search \"lang:en near:\"Melbourne\" within:50km until:2020-02-28\" > melb_tweets_FEB.json")
    os.system(
        "snscrape --jsonl --max-results 10000 --since 2020-03-01 twitter-search \"lang:en near:\"Melbourne\" within:50km until:2020-03-31\" > melb_tweets_MAR.json")

    os.system(
        "snscrape --jsonl --max-results 10000 --since 2020-04-01 twitter-search \"lang:en near:\"Melbourne\" within:50km until:2020-04-30\" > melb_tweets_APR.json")
    os.system(
        "snscrape --jsonl --max-results 10000 --since 2020-05-01 twitter-search \"lang:en near:\"Melbourne\" within:50km until:2020-05-31\" > melb_tweets_MAY.json")
    os.system(
        "snscrape --jsonl --max-results 10000 --since 2020-06-01 twitter-search \"lang:en near:\"Melbourne\" within:50km until:2020-06-30\" > melb_tweets_JUN.json")

    os.system(
        "snscrape --jsonl --max-results 10000 --since 2020-07-01 twitter-search \"lang:en near:\"Melbourne\" within:50km until:2020-07-31\" > melb_tweets_JUL.json")
    os.system(
        "snscrape --jsonl --max-results 10000 --since 2020-08-01 twitter-search \"lang:en near:\"Melbourne\" within:50km until:2020-08-31\" > melb_tweets_AUG.json")
    os.system(
        "snscrape --jsonl --max-results 10000 --since 2020-09-01 twitter-search \"lang:en near:\"Melbourne\" within:50km until:2020-09-30\" > melb_tweets_SEP.json")

    # process each tweet and push to melbourne database

    # get a Processor which is specific to snscrape outputs
    process = process_snscrape.Processor()

    # connect to our couch database
    my_couch = couchDatabase.CouchDatabase()

    # go through each file for each month (we do it separately to ensure maximised num of tweets)
    months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP"]
    for month in months:
        with open("melb_tweets_" + month, 'r') as f:
            for i in f:
                try:
                    tweet = json.loads(i.strip())
                    tweet_dict = process.process_tweet(tweet)
                    my_couch.add_tweet(tweet_dict, "melbourne")
                except:
                    pass


# if this script is run from command
if __name__ == '__main__':
    try:
        main()
    except IndexError:
        print("could not run!")
