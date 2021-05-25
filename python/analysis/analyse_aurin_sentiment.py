import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import json
import geopandas as gpd
import re
import sys
from twitter_harvester import couchDatabase
import statsmodels.api as sm
import os


def attr_from_metadata(city):
    # this function will extract the variable description/name from the metadata
    metaFile = "./AURIN_DATA/" + city + "/metadata_" + city + ".json"
    with open(metaFile, 'r') as f:
        # extract attribute data from the metadata file first
        colNames = []
        colNamesDict = {}
        # iterate through metadata file and get name and variable
        for i in f:
            metaData = json.loads(i)
            attr = metaData["selectedAttributes"]
            for j in attr:
                colNames.append((j['name'], j['title']))
                colNamesDict[j['name']] = j['title']
                # print("Code: {} \t Name: {}".format(i['name'],i['title']))
    return colNames


def aurin_data(city):
    # open the shp file containing the geometry and the data for each SA2 suburb
    # return the dataframe
    shpFile = "./AURIN_DATA/" + city + "/shp/" + city + ".shp"
    DF = gpd.read_file(shpFile)
    return DF


def create_aurin_name_dict(metadata, df_cols):
    # create a dictionary that contains the variable name and the description of the variable
    # this assume that the metadata and the dataframe from the shp file are ordered in the same way
    name_dict = {}
    for i in range(len(metadata)):
        name_dict[df_cols[i]] = metadata[i][1]
    return name_dict


def aggregate_life_scores(df, name_dict):
    # aggregate the life score variables into a single measure of life satisfaction
    cols = df.columns
    aggregate = np.zeros(len(df))
    popn = np.zeros(len(df))
    # iterate through all ten columns
    for i in cols:
        if "M0__life" in i:
            val = int(re.findall(r'at ([0-9]+)', str(name_dict[i]))[0])
            # take the weighted sum of the life satisfaction score (between 0 and 10) times the # ppl who voted for it
            aggregate = aggregate + (np.array(df[i])) * val
            # take the total population to rescale the scores
            popn = popn + np.array(df[i])
    return np.divide(aggregate, popn)


def homeless_rate(df, homeless_var, pop_var):
    # calc the homelessness rate using population and homeless #
    return np.divide(np.array(df[homeless_var]), np.array(df[pop_var]))


def setup_data(city):
    # this script will setup the data frame output of the AURIN data with the varibales we want
    # it will work for ALL cities (hence we have to hardcore some values to make it flexible)
    metadata = attr_from_metadata(city)
    aurin_DF = aurin_data(city)
    name_dict = create_aurin_name_dict(metadata, aurin_DF.columns)
    # iterate through all the variables provided and extract the correct variable depending on the hardocded "theme"
    # e.g. Population or Median age
    for i in name_dict:
        # print(i,name_dict[i])
        if "Population" in name_dict[i]:
            population_var = i
        if "Homeless" in name_dict[i]:
            homeless_var = i
        if "SA2 Name" in name_dict[i]:
            name_var = i
        if "SA2 Code 2016" in name_dict[i]:
            code_var = i
        if "Median age" in name_dict[i]:
            age_var = i
        if "Median total personal income" in name_dict[i]:
            inc_var = i
        if "Labour force" in name_dict[i]:
            unemp_var = i
        if "Poverty Rate (proportion of people with equivalised disposable household income after housing costs is " \
           "below half median equivalised disposable household income after housing costs)" in name_dict[i]:
            pov_var = i
        if "Housing Stress" in name_dict[i]:
            hous_var = i
        if "Gini Coefficient" in name_dict[i]:
            gini_var = i
        if "IER Score" in name_dict[i] or "IEO Score" in name_dict[i]:
            ier_ieo_var = i
        if "Religious Affiliation" in name_dict[i]:
            relig_var = i
        if "Citizenship Status" in name_dict[i]:
            citi_var = i
    # life satisfaction score and homeless rate need to be modified before using
    aurin_DF['life_satisfaction_score'] = aggregate_life_scores(aurin_DF, name_dict)
    aurin_DF['homeless_rate'] = homeless_rate(aurin_DF, homeless_var, population_var)

    # let's select the variables we want (note that more cities should have same vars included)
    # this section is ~/HARDCODED/~
    required_cols = [code_var, name_var, age_var, population_var, inc_var, "life_satisfaction_score",
                     unemp_var, "homeless_rate", hous_var, gini_var, pov_var, ier_ieo_var,
                     relig_var, citi_var]

    required_cols_names = []
    for x in required_cols:
        if x != 'life_satisfaction_score' and x != 'homeless_rate':
            # let's rename the columns since they are too wordy
            if "Poverty Rate" in name_dict[x]:
                required_cols_names.append("poverty_rate")
            elif "Religious" in name_dict[x]:
                required_cols_names.append("percent_nonreligious")
            elif "Citizenship" in name_dict[x]:
                required_cols_names.append("percent_citizenship")
            elif "Labour force" in name_dict[x]:
                required_cols_names.append("percent_unemployed")
            elif "Total Usual" in name_dict[x]:
                required_cols_names.append("population")
            elif "Median age" in name_dict[x]:
                required_cols_names.append("median_age")
            elif "Median total personal" in name_dict[x]:
                required_cols_names.append("median_weekly_personal_income")
            elif "Housing" in name_dict[x]:
                required_cols_names.append("housing_stress_30_40_rule")
            elif "Gini" in name_dict[x]:
                required_cols_names.append("gini_coefficient")
            elif "IEO" in name_dict[x]:
                required_cols_names.append("ieo_score")
            elif "IER" in name_dict[x]:
                required_cols_names.append("ier_score")
            else:
                required_cols_names.append(name_dict[x])
        else:
            if x == 'life_satisfaction_score':
                required_cols_names.append("average_life_satisfaction_score")
            else:
                required_cols_names.append("homeless_rate")

    # finally let's output the required dataframe with the modified names as above
    output = aurin_DF[required_cols]
    output.columns = required_cols_names
    return output


def main(city):
    # setup the AURIN data and return the dataframe
    data = setup_data(city)
    # create code to name dictionary
    code = list(data['SA2 Code 2016'])
    # print(code)
    name = list(data['SA2 Name'])
    name_code = {code[i]: name[i] for i in range(len(code))}

    # setup couchdb instance so that we can push analysed data
    couch = couchDatabase.CouchDatabase()
    sentiment_by_week = couch.get_view(city, view='bySuburb2', level=1)
    cols = list(zip(sentiment_by_week[0], sentiment_by_week[1], sentiment_by_week[2]))
    sentiment = pd.DataFrame(cols, columns=["sentiment", "counts", "suburb_code"])

    # for i in sentiment["suburb_code"]:
    #     try:
    #         print("MATCHED!!!!! - " + name_code[i])
    #     except:
    #         print("NO SUCH MATCH!!!! - " + str(i))

    # merge data and sentiment into single DF
    merged_data = data.merge(sentiment, left_on=['SA2 Code 2016'], right_on=['suburb_code'])
    merged_data = merged_data.dropna()
    # print(merged_data.columns)

    # create the X,y data used for analysis
    y = merged_data['sentiment']
    X = merged_data.drop(['SA2 Code 2016', 'SA2 Name', 'sentiment', 'counts', 'suburb_code'], axis=1)

    # organise output locations/folders
    try:
        os.mkdir("./OUTPUT")
    except FileExistsError:
        pass

    os.mkdir("./OUTPUT/"+city)
    os.mkdir("./OUTPUT/"+city+"/by_suburb")
    os.mkdir("./OUTPUT/"+city+"/by_week")



    # data analysis using statsmodels
    X = sm.add_constant(X)  # adding a constant
    model = sm.OLS(y, X).fit()
    print_model = str(model.summary())
    print(print_model)
    file_out = open("./OUTPUT/"+city+"/by_suburb/"+city + "_output.txt", 'w')
    file_out.write(print_model)
    file_out.close()

    # partial regression plots
    X2 = X
    X2['sentiment'] = y
    for i in list(X.columns):
        if "sentiment" not in i:
            cols = list(X.columns.copy())
            cols.remove(i)
            cols.remove('sentiment')
            ax = plt.axes()
            fig = sm.graphics.plot_partregress("sentiment", i, cols, data=X2, obs_labels=False, ax=ax)
            fig.tight_layout(pad=1.0)
            ax.set_xlabel(i)
            ax.set_ylabel("Average sentiment")
            ax.set_title("Partial regression plots - "+city.capitalize())
            plt.savefig("./OUTPUT/"+city + "/by_suburb/" + i +"_partial_regression")
            plt.close()


    # let's plot the time series now!

    avg_sentiment, count, time = couch.get_view(city, view='byWeek2')

    def plot_df(df, x, y, city, title="", xlabel="", ylabel="", dpi=100):
        plt.figure(figsize=(16,5), dpi=dpi)
        plt.plot(df[x], df[y], color='tab:red')
        plt.xticks(rotation=45)
        ax = plt.gca()
        ax.set(title=title, xlabel=xlabel, ylabel=ylabel)
        plt.gcf().subplots_adjust(bottom=0.15)
        plt.savefig("./OUTPUT/"+city + "/by_week/" + city +"_time_series")
        plt.close()

    weekly_senti_df = pd.DataFrame(list(zip(avg_sentiment, count, time)), columns=['average sentiment', 'count', 'week'])
    plot_df(weekly_senti_df, x='week', y='average sentiment', city = city, xlabel='Week start date', ylabel='Average sentiment',
            title='Average tweet sentiment - ' + city.capitalize() + ' - Jan 2020 to April 2021')



if __name__ == '__main__':
    try:
        city = sys.argv[1]
        main(city)
    except:
        pass
