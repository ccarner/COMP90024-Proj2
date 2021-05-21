import pandas as pd
import tweepy
import json
import os.path
from datetime import datetime
from dateutil import tz

def main(city = "Melbourne", max_tweets = 20):
    # Keys and Tokens
    consumerKey = "6y7CUJ9FtcsarPqeEl925m9qp"
    consumerSecret = "gBNK3J59tFIOLel83wlzOrqW5nw7w48iUe8p76aRNghMSBt7ZA"
    accessToken = "1394452093558157315-QMvYgcjS7hV7ZilnFBMHezn0zuISfs"
    accessTokenSecret = "Frz3DWOUATpzQG06dFHFsM98afX6ZxdViAIpjaFUIrqF0"

    # Authenticate to Twitter
    auth = tweepy.OAuthHandler(consumerKey, consumerSecret)
    auth.set_access_token(accessToken, accessTokenSecret)
    api = tweepy.API(auth, wait_on_rate_limit=True)

    # Verify that the Twitter API details are valid
    try:
        api.verify_credentials()
        print("Authentication Complete")
    except:
        print("Authentication Error")
        
    # Approximate geolocations and radii of main Australian cities
    geo_dict = {}
    geo_dict['Melbourne'] = "-37.871901,145.071002,44km"
    geo_dict['Sydney'] = "-33.803556,150.984345,40km"
    geo_dict['Brisbane'] = "-27.446910,152.968343,26km"
    geo_dict['Perth'] = "-31.948084,115.585807,53km"
    geo_dict['Adelaide'] = "-34.921422,138.501053,41km"
    # https://www.mapdevelopers.com/draw-circle-tool.php?circles=%5B%5B44000%2C-37.8719005%2C145.0710015%2C%22%23AAAAAA%22%2C%22%23000000%22%2C0.4%5D%5D
    # https://www.mapdevelopers.com/draw-circle-tool.php?circles=%5B%5B40000%2C-33.8035563%2C150.9843451%2C%22%23AAAAAA%22%2C%22%23000000%22%2C0.4%5D%5D
    # https://www.mapdevelopers.com/draw-circle-tool.php?circles=%5B%5B26000%2C-27.4469099%2C152.9683435%2C%22%23AAAAAA%22%2C%22%23000000%22%2C0.4%5D%5D
    # https://www.mapdevelopers.com/draw-circle-tool.php?circles=%5B%5B53000%2C-31.9480842%2C115.5858068%2C%22%23AAAAAA%22%2C%22%23000000%22%2C0.4%5D%5D
    # https://www.mapdevelopers.com/draw-circle-tool.php?circles=%5B%5B41000%2C-34.9214222%2C138.5010531%2C%22%23AAAAAA%22%2C%22%23000000%22%2C0.4%5D%5D    
    
    # Search terms related to coronavirus tweets
    covid_terms = """#coronavirus OR coronavirus OR covid OR #covid OR covid19 
    OR #covid19 OR covid-19 OR sarscov2 OR #sarscov2 OR sars OR cov2 OR 
    covid_19 OR #covid_19"""
    
    # retrieves tweets Using Covid queries, filters retweets, specifies city
    tweets = tweepy.Cursor(api.search, q=covid_terms + " -filter:retweets", 
                           geocode=geo_dict[city], tweet_mode="extended", 
                           lang="en").items(max_tweets)
    
    # Converts harvested tweets to a panda format with only required details
    tweet_df = tweets_to_pandas(tweets, city)
    #print(tweet_df)
    
    return tweet_df

    
def tweets_to_pandas(tweets, city):
    """ Formats all tweet data that is relevant for sentiment analysis and 
    location comparison into pandas dataframe"""
    tweet_data = []
    
    # Extracting relevant information from tweet and appending as a list
    for tweet in tweets:
        tweet_time = change_timezone(tweet.created_at, city) # Converting time
        tweet_data.append([tweet.id_str, None, city, tweet.coordinates, 
                              tweet.full_text, tweet_time, None, None, None])
        
    # Creating Pandas dataframe from nested twitter lists
    columns = ['_id','_rev', 'city', 'coord', 'text', 'time', 'sentiment', 
               'sa2Code', 'sa2Name']     
    tweet_df = pd.DataFrame(tweet_data, columns=[columns]) 
    
    return tweet_df


def change_timezone(tweet_time, toCity, fromCity = 'UTC'):
    """ Given a tweet time and cities returns the new time. Default UTC input"""
    # Specifying cities/Timezones required for conversion 
    utc_time_zone = tz.gettz(fromCity)
    tweet_time_zone = tz.gettz(str('Australia/'+ toCity))
    
    # Updating information in datetime to include UTC information
    tweet_time = tweet_time.replace(tzinfo=utc_time_zone)
    
    # Changing timezone
    new_time = tweet_time.astimezone(tweet_time_zone)
    
    # Removing microseconds
    new_time = new_time.replace(microsecond=0)
    
    return new_time
    
def pandas_save_csv(tweet_df, filename = 'test.csv'):
    """ Given a pandas formatted tweet dataframe and csv filename will either 
    append to the existing file or create the file if it does not exist """
    if os.path.exists(filename):
        tweet_df.to_csv(filename, mode='a', header=False) # Append df CSV file
    else:
        tweet_df.to_csv(filename) # Convert df to new CSV file
        
    return

def pandas_save_json(tweet_df, filename = 'test.json'):
    """ Given a pandas formatted tweet dataframe and json filename will either 
    append to the existing file or create the file if it does not exist """    
    if os.path.exists(filename):
        tweet_df.to_json(filename, mode='a', header=False) # Append df json file
    else:
        tweet_df.to_json(filename) # Convert df to new json file
        
    return

#df = main()
#pandas_save_csv(df)

""" 
- Do we want to add other information such as list of processed words and 
  sentiment allocation (not just the number)
- Require to add a main function for all analyses programs, this will have the
  limits on the calls to the twitter harvesters
"""