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
  // console.log("Memory usage 1", process.memoryUsage());
  const geojsonArray = getGeoJSONArray();

  const reducer = (accumulator, currentValue) => concatGeoJSON(accumulator, currentValue);

  let geojson = geojsonArray.reduce(reducer);
  // console.log("Memory usage 2", process.memoryUsage());


  // Fetch suburb aurin data and combine into one json
  let aurin_data = getSuburbAURINData();

  // console.log("Memory usage 3:", process.memoryUsage());

  // console.log(geojson);
  // Combine aurin and suburb data
  const suburbAndAurinData = combineSuburbWithAurin(geojson, aurin_data);

  // console.log(suburbAndAurinData);
    
  const all_states = getCityData();
  // console.log("Memory usage 4", process.memoryUsage());
  return {
    props: {suburbData: suburbAndAurinData, cityData: all_states} 
  }
}

export default function Home({suburbData, cityData}) {
  const [suburbs, setSuburbOn] = useState(false);

  // console.log(cityData);
  return (
      <MapBox suburbData={suburbData} cityData={cityData} suburbOn={suburbs} activateSuburbs={setSuburbOn}/>
  )
}      