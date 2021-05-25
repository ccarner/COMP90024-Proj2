import React, {useState} from 'react';
import dynamic from 'next/dynamic'
import Layout from '../components/Layout';
import {getGeoJSONArray, getCityData, getSuburbAURINData} from '../utils/dataloaders';
import {combineSuburbWithAurin} from '../utils/helpers';

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

  const all_states = getCityData();
  return {
    props: {suburbData: suburbAndAurinData, cityData: all_states} 
  }
}

export default function Home({suburbData, cityData}) {
  const [suburbs, setSuburbOn] = useState(false);

  return (
      <MapBox suburbData={suburbData} cityData={cityData} suburbOn={suburbs} activateSuburbs={setSuburbOn}/>
  )
}      