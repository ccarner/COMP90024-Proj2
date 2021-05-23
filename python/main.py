import sys
# sys.path.insert(0, './twitter_harvester')
from twitter_harvester import twitterCorpusDownload
from twitter_harvester import twitterStreamer

if __name__ == '__main__':
    try:
        city = sys.argv[1]  # which city to analyse
        twitterCorpusDownload.request_twitter_corpus(city)
        twitterStreamer.runStreamer(city)
        # also have to add a line for harvester - incomplete!
        # also add analysis data here too!
    except IndexError:
        print("Not enough arguments provided!")
