import Axios from 'axios';

const stateToCity = {
    'New South Wales' : 'sydney',
    'Victoria' : 'melbourne',
    'Queensland': 'brisbane',
    'South Australia': 'adelaide',
    'Western Australia' : 'perth'
  }

// Retrieve the array of suburb geojson data for Australia
export function getGeoJSONArray(){
    let melb_geo =  require('../data/state-suburbs/melbourne.json');
    let adelaide_geo = require('../data/state-suburbs/adelaide.json');
    let perth_geo = require('../data/state-suburbs/perth.json');
    let sydney_geo = require('../data/state-suburbs/sydney.json');
    let brisbane_geo = require('../data/state-suburbs/brisbane.json');
    return [melb_geo, adelaide_geo, perth_geo, sydney_geo, brisbane_geo]
  }

export function loadCovidData(){
  let confirmed = require('../data/covid19/cumulative_cases.json');
  let deaths = require('../data/covid19/cumulative_deaths.json');
  return [confirmed, deaths];
}

export function getSuburbAURINData(){
    let melb_aurin = require('../data/AURIN/melbourne_aurin.json');
    let adelaide_aurin = require('../data/AURIN/adelaide_aurin.json');
    let perth_aurin = require('../data/AURIN/perth_aurin.json');
    let sydney_aurin = require('../data/AURIN/sydney_aurin.json');
    let brisbane_aurin = require('../data/AURIN/brisbane_aurin.json');
    return {
        ...melb_aurin,
        ...adelaide_aurin,
        ...perth_aurin,
        ...sydney_aurin,
        ...brisbane_aurin
    }
}

  // Combine city geojson data with city sentiment data
export function getCityData(){
    const states = require('../data/states.json');
    for (var i = 0; i < states.features.length; i++){
      var state_name = states["features"][i]["properties"]["STATE_NAME"];
    //   console.log(state_name);
      var sentiment = {};
      if (state_name in stateToCity){
        // console.log("Time series data is available for this city ", state_name);
        // Change this line to a GET request to retrieve from the database.
        const weekly = require(`../data/Weekly/${stateToCity[state_name]}_byWeek.json`);
        var rows = weekly.rows;
        // console.log(rows);
        rows.forEach((row) => {
          var city_name = row["key"][0];
          var year = row["key"][1];
          var month = row["key"][2];
        //   console.log(city_name, year, month);
          var average_sentiment = row["value"]["sum"] / row["value"]["count"]
          row["value"]["average_sentiment"] = average_sentiment; //Add average sentiment
          // row["key"] = [year, month]; // Don't need the city name in the key
          sentiment[[year, month]] = row["value"];
        //   console.log(sentiment[[year, month]]);
        })
      
      }
      // Fake data so that sentiment isn't empty for any state
      sentiment[[2018, 0]] = {"sum":72.92009999999999,"min":-0.9249,"max":0.9686,"count":581,"sumsqr":81.17477417};
      states["features"][i]["properties"]["SENTIMENT"] = sentiment;
    }
    return states;
  }