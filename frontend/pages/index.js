import React, {useState} from 'react';
import dynamic from 'next/dynamic'
import Layout from '../components/Layout';
// import Axios from 'axios';

const MapBox = dynamic(() => import("../components/MapBox"), {
  loading: () => <Layout><p>"Loading..."</p></Layout>,
  ssr: false
});

// Concats two geoJSONs into one
function concatGeoJSON(g1, g2){
  return { 
      "type" : "FeatureCollection",
      "features": [... g1.features, ... g2.features]
  }
}

// Retrieve the array of suburb geojson data for Australia
function getGeoJSONArray(){
  const melb_geo =  require('../data/melbourne.json');
  const adelaide_geo = require('../data/adelaide.json');
  const perth_geo = require('../data/perth.json');
  const sydney_geo = require('../data/sydney.json');
  const brisbane_geo = require('../data/brisbane.json');
  return [melb_geo, adelaide_geo, perth_geo, sydney_geo, brisbane_geo]
}

const stateToCity = {
  'New South Wales' : 'Sydney',
  'Victoria' : 'Melbourne',
  'Queensland': 'Brisbane',
  'South Australia': 'Adelaide',
  'Western Australia' : 'Perth'
}

// Combine city geojson data with city sentiment data
function getCityData(){
  const states = require('../data/states.json');
  for (var i = 0; i < states.features.length; i++){
    var state_name = states["features"][i]["properties"]["STATE_NAME"];
    console.log(state_name);
    if (state_name in stateToCity){
      console.log("Time series data is available for this city ")
      if (state_name == "South Australia"){
        const adelaide = require('../data/adl_byWeek.json');
        var sentiment = {}
        var rows = adelaide.rows;
        console.log(rows);
        rows.forEach((row) => {
          var city_name = row["key"][0];
          var year = row["key"][1];
          var month = row["key"][2];
          console.log(city_name, year, month);
          var average_sentiment = row["value"]["sum"] / row["value"]["count"]
          row["value"]["average_sentiment"] = average_sentiment; //Add average sentiment
          // row["key"] = [year, month]; // Don't need the city name in the key
          sentiment[[year, month]] = row["value"];
          console.log(sentiment[[year, month]]);
        })
        states["features"][i]["properties"]["SENTIMENT"] = sentiment;
      }
    }
  }
  return states;
}

export async function getStaticProps(context) {
  console.log("Fetching")

  const geojsonArray = getGeoJSONArray();

  const reducer = (accumulator, currentValue) => concatGeoJSON(accumulator, currentValue);

  const geojson = geojsonArray.reduce(reducer);
  
  // const adelaide_city = require('../data/MetropolitanAdelaideBoundary_GDA2020.json');
  
  const all_states = getCityData();
  
  return {
    props: {suburbData: geojson, cityData: all_states}
  }
}
export default function Home({suburbData, cityData}) {
  const [suburbs, setSuburbOn] = useState(false);

  console.log(cityData);
  return (
      <MapBox suburbData={suburbData} cityData={cityData} suburbOn={suburbs} activateSuburbs={setSuburbOn}/>
  )
}      