import React, {useState} from 'react';
import dynamic from 'next/dynamic'
// import Axios from 'axios';

const MapBox = dynamic(() => import("../components/MapBox"), {
  loading: () => <p>"Loading..."</p>,
  ssr: false
});

function concatGeoJSON(g1, g2){
  return { 
      "type" : "FeatureCollection",
      "features": [... g1.features, ... g2.features]
  }
}

function getGeoJSONArray(){
  const melb_geo =  require('../data/melbourne.json');
  const adelaide_geo = require('../data/adelaide.json');
  const perth_geo = require('../data/perth.json');
  const sydney_geo = require('../data/sydney.json');
  const brisbane_geo = require('../data/brisbane.json');
  return [melb_geo, adelaide_geo, perth_geo, sydney_geo, brisbane_geo]
}


export async function getStaticProps(context) {
  console.log("Fetching")

  const geojsonArray = getGeoJSONArray();

  const reducer = (accumulator, currentValue) => concatGeoJSON(accumulator, currentValue);

  const geojson = geojsonArray.reduce(reducer);
  
  const adelaide_city = require('../data/MetropolitanAdelaideBoundary_GDA2020.json');

  return {
    props: {suburbData: geojson, cityData: adelaide_city}
  }
}
export default function Home({suburbData, cityData}) {
  const [suburbs, setSuburbOn] = useState(false);
  return (
      <MapBox suburbData={suburbData} cityData={cityData} suburbOn={suburbs}/>
  )
}      