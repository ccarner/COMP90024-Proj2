import requests
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd


def view_GroupByWeek(database):
    url = "http://admin:admin@172.17.0.2:5984/" + database + "/_design/sentimentViews/_view/groupByWeek?reduce=true&group_level=3"
    # below is by day rather than by week (above)
    #url = "http://admin:admin@172.17.0.2:5984/" + database + "/_design/sentimentViews/_view/groupByWeek?reduce=true&group_level=5"
    output = requests.get(url)
    output_json = output.json()

    avg_sentiment = [x['value']['sum'] / x['value']['count'] for x in output_json['rows']]
    count = [x['value']['count'] for x in output_json['rows']]
    time = [x['key'][1] + "-" + str(x['key'][2]) for x in output_json['rows']]
    # below is by day
    # time = [x['key'][1] + "-" + str(x['key'][2]) + "-" + str(x['key'][4]) for x in output_json['rows']]

    return avg_sentiment, count, time


def view_GroupBySuburb(database, by_week=False):
    if by_week:
        url = "http://admin:admin@172.17.0.2:5984/" + database + "/_design/sentimentViews/_view/groupBySa2?reduce=true&group_level=" + str(3)
    else:
        url = "http://admin:admin@172.17.0.2:5984/" + database + "/_design/sentimentViews/_view/groupBySa2?reduce=true&group_level=" + str(1)

    output = requests.get(url)
    output_json = output.json()
    #print(output_json)

    if by_week:
        avg_sentiment = [x['value']['sum'] / x['value']['count'] for x in output_json['rows']]
        count = [x['value']['count'] for x in output_json['rows']]
        sa2_year_week = [x['key'][0] + "-" + str(x['key'][1]) + "-" + str(x['key'][2]) for x in output_json['rows']]
        return avg_sentiment, count, sa2_year_week
    else:
        avg_sentiment = [x['value']['sum'] / x['value']['count'] for x in output_json['rows']]
        count = [x['value']['count'] for x in output_json['rows']]
        sa2 = [x['key'][0] for x in output_json['rows']]
        return avg_sentiment, count, sa2


# plot time series
def plot_df(df, x, y, title="", xlabel="", ylabel="", dpi=100):
    plt.figure(figsize=(16,5), dpi=dpi)
    plt.plot(df[x], df[y], color='tab:red')
    plt.xticks(rotation=45)
    ax = plt.gca()
    ax.set(title=title, xlabel=xlabel, ylabel=ylabel)
    #ax.set_xticklabels(ax.get_xticks(), rotation=45)
    plt.show()


#print(view_GroupByWeek('sydney'))
#print(view_GroupBySuburb('sydney'))

#print(view_GroupByWeek('brisbane'))
#print(view_GroupBySuburb('brisbane'))

avg_senti_syd, count_syd, week_syd = view_GroupByWeek('sydney')
syd_weekly_senti_df = pd.DataFrame(list(zip(avg_senti_syd, count_syd, week_syd)), columns=['average sentiment','count','week'])
print(avg_senti_syd, count_syd, week_syd)
print(syd_weekly_senti_df)

plot_df(syd_weekly_senti_df, x='week', y='average sentiment', xlabel='Year-Week', ylabel='Sentiment', title='Average tweet sentiment in Sydney from 2020 to April 2021')
#plot_df(syd_weekly_senti_df, x='week', y='count', title='Coordinate-tagged tweet count in Sydney from 2020 to April 2021')



#
# avg_senti_melb, count_melb, week_melb = view_GroupByWeek('melb_coords')
# melb_weekly_senti_df = pd.DataFrame(list(zip(avg_senti_melb, count_melb, week_melb)), columns=['average sentiment','count','week'])
# print(avg_senti_melb, count_melb, week_melb)
# print(melb_weekly_senti_df)
#
# plot_df(melb_weekly_senti_df, x='week', y='average sentiment', xlabel='Year-Week', ylabel='Sentiment', title='Average tweet sentiment in Melbourne from 2020 to April 2021')
# #plot_df(syd_weekly_senti_df, x='week', y='count', title='Coordinate-tagged tweet count in Melbourne from 2020 to April 2021')
