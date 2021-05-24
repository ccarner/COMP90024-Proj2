import React, {useState} from "react";
import MapHeader from "./MapHeader";
import Footer from "./Footer";
import Head from "next/head";
import MapGL, {FlyToInterpolator, Source, Layer} from 'react-map-gl';
import ControlPanel from "./ControlPanel";


const suburbLayer = {
  id: 'suburbs_data',
  type: 'line',
  source: 'suburbs',
  "paint": {
    "line-color": "#22B0C0",
    "line-width": 0.5,
    "line-opacity": 1
  }
};

const stateLayer = {
  id: 'state_data',
  type: 'line',
  source: 'states',
  "paint": {
    "line-color": "#22B0C0",
    "line-width": 0.5,
    "line-opacity": 1
  }
};


export default function MapBox({suburbData, cityData, suburbOn, activateSuburbs}) {
  console.log(suburbData);
  const [viewport, setViewport] = useState({
    latitude: -25.2744,
    longitude: 133.775,
    zoom: 4.2,
    bearing: 0,
    pitch: 0,
    width: "100%",
    height: "100%"
  });

  const goTo = (long, lat, zm) => {
    setViewport({
      ...viewport,
      longitude: long,
      latitude: lat,
      zoom: zm,
      transitionDuration: 3000,
      transitionInterpolator: new FlyToInterpolator(),
      // transitionEasing: d3.easeCubic
    });
  };

  const [city, setCity] = useState("All States");
  const [year, setYear] = useState(2020);

  return (
    <>
      <Head>
        <title>
          "COMP90024"
        </title>
      </Head>
      <MapHeader goToCoord={goTo} currCity={city} changeCityTo={setCity} usage={"map"} setSuburbOn={activateSuburbs}/>
      <MapGL
        {...viewport}
        width="100vw"
        height="100vh"
        mapStyle="mapbox://styles/shijiel2/cjvcb640p3oag1gjufck6jcio"
        onViewportChange={setViewport}
        mapboxApiAccessToken={process.env.MAPBOX_API_TOKEN}
      >
        {suburbOn ?       
        <Source key={1} id="suburbs" type="geojson" data={suburbData}>
          <Layer {...suburbLayer} />
        </Source> 
        :       
        <Source key={2} id="states" type="geojson" data={cityData}>
          <Layer {...stateLayer} />
        </Source>
      }
      </MapGL>
      <ControlPanel year={year} onChange={value => setYear(value)} />
      <Footer />
    </>
  )
}