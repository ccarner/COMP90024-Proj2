import React from 'react';
import dynamic from 'next/dynamic'
// import Axios from 'axios';

const MapBox = dynamic(() => import("../components/MapBox"), {
  loading: () => <p>"Loading..."</p>,
  ssr: false
});

export async function getStaticProps(context) {
  console.log("Fetching")
  const melb_geo =  require('../data/melbourne.json');
  return {
    props: {suburbData: melb_geo}
  }
}
export default function Home({suburbData}) {      
  // console.log(suburbData)
  return (
      <MapBox suburbData={suburbData}/>
  )
}      