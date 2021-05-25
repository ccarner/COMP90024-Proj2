import couchdb
from couchdb.design import ViewDefinition
import requests
import json
from datetime import date
from .mapreducefunct import MAP_BY_SUBURB, MAP_BY_WEEK, REDUCE_STATS, MAP_BY_SUBURB2, MAP_BY_WEEK2
# import mapreducefunct as mr


class CouchDatabase:

    def __init__(self):
        with open("./twitter_harvester/couchdb_pword.txt", 'r') as f:
            self.url = 'http://' + next(f).strip() + '@localhost:5984'
            self.DB = couchdb.Server(self.url)
        self.setup_databases()

    def setup_databases(self) -> None:
        # setup the databases if not yet created
        try:
            self.DB['adelaide']
        except:
            # resource not found error
            self.DB.create('adelaide')
            self.create_views('adelaide')
        try:
            self.DB['perth']
        except:
            # resource not found error
            self.DB.create('perth')
            self.create_views('perth')
        try:
            self.DB['melbourne']
        except:
            # resource not found error
            self.DB.create('melbourne')
            self.create_views('melbourne')
        try:
            self.DB['sydney']
        except:
            # resource not found error
            self.DB.create('sydney')
            self.create_views('sydney')
        try:
            self.DB['brisbane']
        except:
            # resource not found error
            self.DB.create('brisbane')
            self.create_views('brisbane')
        try:
            self.DB['analysis']
        except:
            # resource not found error
            self.DB.create('analysis')

    def add_tweet(self, tweet, database):
        # try add tweet
        try:
            # connect to database
            db = self.DB[database]

            # first check that the tweet isn't already in the database
            tweetID = tweet['_id']
            if db.get(tweetID) is None:
                print("added tweet")
                doc_id, doc_rev = db.save(tweet)
        except:
            # cannot connect to db
            pass

    def create_views(self, db):
        # https://markhaa.se/posts/couchdb-views-in-python/
        # create the two views we will need (by week and by suburb)
        # note that if they already exist in the DB it won't do anything
        view_by_week = ViewDefinition('sentimentDocs', 'byWeek', MAP_BY_WEEK, reduce_fun=REDUCE_STATS)
        view_by_week.get_doc(self.DB[db])
        view_by_week.sync(self.DB[db])

        view_by_suburb = ViewDefinition('sentimentDocs', 'bySuburb', MAP_BY_SUBURB, reduce_fun=REDUCE_STATS)
        view_by_suburb.get_doc(self.DB[db])
        view_by_suburb.sync(self.DB[db])
        
        view_by_week = ViewDefinition('sentimentDocs', 'byWeek2', MAP_BY_WEEK2, reduce_fun=REDUCE_STATS)
        view_by_week.get_doc(self.DB[db])
        view_by_week.sync(self.DB[db])

        view_by_suburb = ViewDefinition('sentimentDocs', 'bySuburb2', MAP_BY_SUBURB2, reduce_fun=REDUCE_STATS)
        view_by_suburb.get_doc(self.DB[db])
        view_by_suburb.sync(self.DB[db])

    def get_view(self, database, view='byWeek', level=3):
        url = self.url + "/{}/_design/sentimentDocs/_view/{}?reduce=true&group_level={}".format(database, view, level)
        output = requests.get(url)
        if output.status_code == 404:
            print("Unable to retrieve view")
        else:
            output_json = output.json()
            avg_sentiment = [x['value']['sum'] / x['value']['count'] for x in output_json['rows']]
            count = [x['value']['count'] for x in output_json['rows']]
            if view == 'byWeek' or view == 'byWeek2':
                time = [str(x['key'][1]) + "-" + str(x['key'][2]) for x in output_json['rows']]
                toDate = lambda x: date.fromisocalendar(int(x.split("-")[0]), int(x.split("-")[1]), 1)
                time = [toDate(x).strftime('%d-%m-%Y') for x in time]
                return avg_sentiment, count, time
            else:
                sa2 = [x['key'][0] for x in output_json['rows']]
                return avg_sentiment, count, sa2
