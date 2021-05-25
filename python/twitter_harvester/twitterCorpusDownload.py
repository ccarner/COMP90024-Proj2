import requests
from .process import Processor
import json
from .couchDatabase import CouchDatabase
import sys


def request_twitter_corpus(city, date_start="1/1/2020", date_end="30/4/2021", every_nth_tweet=1000):
    # create tweet processor
    processor = Processor(city)

    # connect to database
    our_couch = CouchDatabase()

    # create variables for request to twitter corpus database
    auth = ('readonly', 'cainaimeeshaLu4Lejoo9ooW4jiopeid')
    url = 'http://couchdb.socmedia.bigtwitter.cloud.edu.au/twitter/_design/twitter/_view/summary'

    date_st = date_start.split("/")
    date_end = date_end.split("/")

    params = {
        'reduce': 'false',
        'include_docs': 'true',
        'start_key': '[\"{}\", {}, {}, {}]'.format(city,date_st[2],date_st[1],date_st[0]),
        'end_key': '[\"{}\", {}, {}, {}]'.format(city,date_end[2],date_end[1],date_end[0]),
    }

    with requests.get(url, auth=auth, params=params, stream=True) as r:
        r.raise_for_status()
        # create counter so we only process every nth tweet (otherwise takes too long)
        counter = 0
        for chunk in r.iter_lines():
            try:
                tweet = json.loads(chunk.decode("utf-8").strip().strip(','))['doc']
                # only process and add tweet if i) has coordinates or ii) is every 20th tweet
                # this is to ensure we can finish in time
                if tweet['coordinates'] is not None or counter % int(every_nth_tweet) == 0:
                    print('got a tweet which was tagged')
                    tweet_dict = processor.process_tweet(tweet)
                    our_couch.add_tweet(tweet_dict, city)
                counter += 1
            except:
                # could not parse (usually will be first or last line)
                pass


# if this script is run from command line as python city date1 date2 n
# we want it to run the corpus download
if __name__ == '__main__':
    try:
        city = sys.argv[1]
        date1 = sys.argv[2]
        date2 = sys.argv[3]
        n = sys.argv[4]
        request_twitter_corpus(city, date_start=date1, date_end=date2, every_nth_tweet=n)
    except IndexError:
        pass
