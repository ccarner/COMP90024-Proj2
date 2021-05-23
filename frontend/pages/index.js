import React from 'react';
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

export async function getStaticProps(context) {
  console.log("Fetching")
  const melb_geo =  require('../data/melbourne.json');
  const adelaide_geo = require('../data/adelaide.json');
  const geojson = concatGeoJSON(melb_geo, adelaide_geo);
  return {
    props: {suburbData: geojson}
  }
}
export default function Home({suburbData}) {      
  return (
      <MapBox suburbData={suburbData}/>
  )
}      