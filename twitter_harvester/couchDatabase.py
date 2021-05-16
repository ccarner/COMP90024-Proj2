import couchdb


class CouchDatabase:

    def __init__(self):
        self.DB = couchdb.Server('http://admin:admin@172.17.0.2:5984')

    def add_tweet(self, tweet, database):

        # extract DB
        try:
            db = self.DB[database]

            # first check that the tweet isn't already in the database
            tweetID = tweet['_id']
            if db.get(tweetID) is None:
                print("added tweet")
                doc_id, doc_rev = db.save(tweet)

        except:
            pass
