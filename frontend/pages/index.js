import React, {useState} from 'react';
import dynamic from 'next/dynamic'
import Layout from '../components/Layout';
import {getGeoJSONArray, getCityData} from '../utils/dataloaders';
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

  const geojsonArray = getGeoJSONArray();

  const reducer = (accumulator, currentValue) => concatGeoJSON(accumulator, currentValue);

  const geojson = geojsonArray.reduce(reducer);
    
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