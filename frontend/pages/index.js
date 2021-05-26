/*  
COMP90024 Cloud Computing Project 2
  Team 40:
  Mark Drvodelic, 1068574
  Colton Carner, 693280
  Bing Xu, 833684
  Zihao Zhang, 1151006
  Brandon Lulham, 1162377
*/

import React, {useState} from 'react';
import dynamic from 'next/dynamic'
import Layout from '../components/Layout';
import {getGeoJSONArray, getCityData, getSuburbAURINData, loadCovidData} from '../utils/dataloaders';
import {combineSuburbWithAurin} from '../utils/helpers';


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

export async function getStaticProps(context) {
  console.log("Fetching")

  // Fetch suburb geojson data and  combine into one json
  const geojsonArray = getGeoJSONArray();

  const reducer = (accumulator, currentValue) => concatGeoJSON(accumulator, currentValue);

  let geojson = geojsonArray.reduce(reducer);

  // Fetch suburb aurin data and combine into one json
  let aurin_data = getSuburbAURINData();

  // Combine aurin and suburb data
  const suburbAndAurinData = combineSuburbWithAurin(geojson, aurin_data);

  // Covid data
  const covidData = loadCovidData();

  let confirmed_cases = covidData[0];

  let confirmed_deaths = covidData[1];

  const all_states = getCityData();
  return {
    props: {suburbData: suburbAndAurinData, cityData: all_states, covid_cases: confirmed_cases, covid_deaths: confirmed_deaths} 
  }
}

export default function Home({suburbData, cityData, covid_cases, covid_deaths}) {
  const [suburbs, setSuburbOn] = useState(false);

  return (
      <MapBox covidCases={covid_cases} covidDeaths={covid_deaths} suburbData={suburbData} cityData={cityData} suburbOn={suburbs} activateSuburbs={setSuburbOn}/>
  )
}      