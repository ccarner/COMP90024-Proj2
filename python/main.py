from twitter_harvester import twitterCorpusDownload
from twitter_harvester import twitterStreamer
from twitter_harvester import scrape_tweets
from analysis import analyse_aurin_sentiment

if __name__ == '__main__':
    try:
        city = sys.argv[1]  # which city to analyse
        task = sys.argv[2] # what script to run out of: streamer, corpus download
        if task == "streamer":
        	twitterStreamer.runStreamer(city)
        elif task == "corpus":
        	twitterCorpusDownload.request_twitter_corpus(city)
        	if city == 'melbourne':
        		scrape_tweets.main()
        elif task == "analysis":
        	analyse_aurin_sentiment.main(city)
        else:
        	print("invalid task!")
    except IndexError:
        print("Not enough arguments provided!")
