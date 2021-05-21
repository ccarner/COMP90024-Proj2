### Upload to https://github.com/ccarner/COMP90024-Proj2  
import nltk
nltk.download('stopwords')
nltk.download('twitter_samples')
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('wordnet')
from nltk import classify, NaiveBayesClassifier # For model
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from nltk.corpus import twitter_samples
from nltk.corpus import wordnet as wn
from nltk.stem import WordNetLemmatizer
from nltk.tag import pos_tag # for pos 
import re # substituting using regex expressions
import random
import sys
import string
#nltk
#nltk.download('stopwords')
#nltk.download('punkt') # required for pos
#nltk.download('averaged_perceptron_tagger') # required for pos 
#nltk.download('wordnet') 

def tokenize(tweet, face_regex):
    """Removes all hyperlinks, usernames and punctuation (faces exempt) from a
    tweet and tokenizes everything. Primary use is to improve text matching."""
    tweet = tweet.lower()
    tweet = re.sub(r'http\S+', '', tweet) # Removing hyperlinks
    tweet = re.sub("(@[A-Za-z0-9_]+)","", tweet) # Removing usernames
    
    # Identifies faces in a tweet and then removes all puncuation
    tweet_faces = re.findall(face_regex, tweet) 
    tweet = tweet.translate(str.maketrans('', '', string.punctuation))
    
    # Tokenizing tweet and readding faces (as tokens) to the token list
    tweet_tokens = word_tokenize(tweet)
    tweet_tokens += tweet_faces

    return tweet_tokens
    
    
    
def token_clean(tweet_tokens, stop_words):
    """Removes all stop words and lemmatizes the tweet tokens utilising tags 
    which identify the word type (e.g. verb, noun etc) when available"""
    tweet_tokens_clean = []
    
    # Removing stop words 
    tweet_tokens = [word for word in tweet_tokens if not word in stop_words]
    
    # Assigning treebank tags (identifying word type) to tweet tokens
    tweet_tokens_pos = nltk.pos_tag(tweet_tokens)
    #print(tweet_tokens_pos)
    
    lemmatizer = WordNetLemmatizer()
    # Iterates through all tweet tokens and tags and lemmatizes the word
    for token, tag in tweet_tokens_pos:
        tag_wn = get_wordnet_pos(tag) # Converts treebank tag to wordnet tag
        if tag_wn != None:
            clean_token = lemmatizer.lemmatize(token, tag_wn) # lemmatizing
        else:
            clean_token = lemmatizer.lemmatize(token) # lemmatizing without tag   
        tweet_tokens_clean.append(clean_token)
        
    return tweet_tokens_clean



def get_wordnet_pos(treebank_tag):
    """Given an treebank tag (nltk.pos_tag) identifies the key part of the tag
    and converts to the relevant wordnet tag for use in accurate lemmatizing"""
    if treebank_tag.startswith('J'):
        return wn.ADJ # Adjective
    elif treebank_tag.startswith('V'):
        return wn.VERB # Verb
    elif treebank_tag.startswith('N'):
        return wn.NOUN # Noun
    elif treebank_tag.startswith('R'):
        return wn.ADV # Adverb
    else:
        return None # Unable to match 


            
def model_format_tweets(cleaned_tokens_list, tweets_are_positive):
    """Takes a list of cleaned tokens and converts the data into a model 
    format to be inputted directly into the Bayesian model"""
    model_train_data = []
    
    # Identifying the corresponding sentiment word
    if tweets_are_positive == True:
        sentiment = 'Positive'
    if tweets_are_positive == False:
        sentiment = 'Negative'
    
    # Reformatting training data into model readable format
    for tweet_tokens in cleaned_tokens_list:
        if tweet_tokens == None:
            continue # if no tweet tokens then continue
        tweet_dictionary_tokens = {}
        for token in tweet_tokens:
            tweet_dictionary_tokens[token] = True

        model_train_data.append((tweet_dictionary_tokens, sentiment))
        
    return model_train_data
            
    
    
def train_classifier(stop_words, face_regex):
    """ Trains a Bayesian Classifer for use in classifying sentiment for incoming 
    Tweets"""
    # Loading in positive and negative tweets
    positive_tweets = twitter_samples.strings('positive_tweets.json')
    negative_tweets = twitter_samples.strings('negative_tweets.json')  
    
    # normalizing, tokenizing and lemmatizing positive tweets
    positive_tweet_tokens = []
    for tweet in positive_tweets:
        tweet_tokens = tokenize(tweet, face_regex)
        tweet_tokens_clean = token_clean(tweet_tokens, stop_words)
        positive_tweet_tokens.append(tweet_tokens_clean)
    
    # normalizing, tokenizing and lemmatizing negative tweets
    negative_tweet_tokens = []
    for tweet in negative_tweets:
        tweet_tokens = tokenize(tweet, face_regex)
        tweet_tokens_clean = token_clean(tweet_tokens, stop_words)
        negative_tweet_tokens.append(tweet_tokens_clean)
    
    # Formatting tweet data for modelling and combining into a single dataset
    model_train_data_positive = model_format_tweets(positive_tweet_tokens, True)
    model_train_data_negative = model_format_tweets(negative_tweet_tokens, False)
    dataset = model_train_data_positive + model_train_data_negative
    #print(dataset) # Dataset must be formatted correctly for the model to use
    
    # Mixing positive and negative tweets then grouping into train and test data
    random.shuffle(dataset)
    train_data = dataset[:7000]
    test_data = dataset[7000:]

    # Training the model with the training dataset
    classifier = NaiveBayesClassifier.train(train_data)
    
    # Testing the model and showing the most leveraged words for sentiment
    #print("Accuracy is:", classify.accuracy(classifier, test_data))
    #print(classifier.show_most_informative_features(20))
    
    return classifier 
