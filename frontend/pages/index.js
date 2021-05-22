import React from 'react';
import dynamic from 'next/dynamic'

const MapBox = dynamic(() => import("../components/MapBox"), {
  loading: () => <p>"Loading..."</p>,
  ssr: false
});

export default function Home() {      
  return (
      <MapBox />
  )
}      