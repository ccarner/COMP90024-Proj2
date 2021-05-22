import React, { useEffect, useRef, useState, createRef } from "react";
import MapHeader from "./MapHeader";
import Footer from "./Footer";
import Head from "next/head";
import MapGL from 'react-map-gl';

const MAPBOX_TOKEN = "pk.eyJ1IjoiYmluZ3gxIiwiYSI6ImNrb3ZpdjdmMDA3b28ycG1zczkzc3p2d2YifQ.XI1rQXCzrpvw5qNwSWM5qg";

export default function MapBox() {
  const [viewport, setViewport] = useState({
    latitude: -37.84,
    longitude: 145.11,
    zoom: 9,
    bearing: 0,
    pitch: 0,
    width: "100%",
    height: "100%"
  });

  console.log(MAPBOX_TOKEN)

  return (
    <>
      <Head>
        <title>
          "COMP90024"
        </title>
      </Head>
      <MapHeader/>
      <MapGL
        {...viewport}
        width="100vw"
        height="100vh"
        mapStyle="mapbox://styles/shijiel2/cjvcb640p3oag1gjufck6jcio"
        // mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={setViewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      />
      <Footer />
    </>
  )
}