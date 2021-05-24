import React, {useState, useMemo, useCallback} from "react";
import MapHeader from "./MapHeader";
import Footer from "./Footer";
import Head from "next/head";
import MapGL, {FlyToInterpolator, Source, Layer} from 'react-map-gl';
import ControlPanel from "./ControlPanel";
import {updateData, decimalYearToMonthAndWeek} from "../utils/helpers";
import styles from "../styles/MapBox.module.css";

const suburbLayer = {
  id: 'suburbs_data',
  type: 'line',
  source: 'suburbs',
  paint: {
    "line-color": "#22B0C0",
    "line-width": 0.5,
    "line-opacity": 1
  }
};

const stateLayer = {
  id: 'state_data',
  type: 'line',
  source: 'states',
  paint: {
    "line-color": "#22B0C0",
    "line-width": 0.5,
    "line-opacity": 1
  }
};

const dataLayer = {
  id: 'data',
  type: 'fill',
  paint: {
    'fill-color': {
      property: 'sentiment',
      stops: [
        [0, '#3288bd'],
        [0.04, '#d53e4f'],
        [0.08, '#f46d43'],
        [0.12, '#fdae61'],
        [0.16, '#fee08b'],
        [0.20, '#ffffbf'],
        [0.24, '#e6f598'],
        [0.28, '#abdda4'],
        [0.32, '#66c2a5']
      ]
    },
    'fill-opacity': 0.8
  }
};


export default function MapBox({suburbData, cityData, suburbOn, activateSuburbs}) {
  // console.log(suburbData);
  const [viewport, setViewport] = useState({
    latitude: -24.3444,
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
  const [year, setYear] = useState(2020.02);
  const [hoverInfo, setHoverInfo] = useState(null);

  const onHover = useCallback(event => {
    const {
      features,
      srcEvent: {offsetX, offsetY}
    } = event;
    const hoveredFeature = features && features[0];

    setHoverInfo(
      hoveredFeature
        ? {
            feature: hoveredFeature,
            x: offsetX,
            y: offsetY
          }
        : null
    );
  }, []);


  const data = useMemo(() => {
    const [curr_year, week_no] = decimalYearToMonthAndWeek(year);
    return cityData && updateData(cityData, f => f.properties.SENTIMENT[[curr_year, week_no]]);
  }, [cityData, year]);

  console.log(data);

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
        interactiveLayerIds={['data']}
        onHover={onHover}
      >
        {suburbOn ?       
        <Source key={1} id="suburbs" type="geojson" data={suburbData}>
          <Layer {...suburbLayer} />
        </Source> 
        :
        <>       
        <Source key={2} id="states" type="geojson" data={cityData}>
          <Layer {...stateLayer} />
        </Source>
        <Source key={3} id="states-fill" type="geojson" data={data}>
          <Layer {...dataLayer} />
        </Source>
        {hoverInfo && (
          <div className={styles.tooltip} style={{left: hoverInfo.x, top: hoverInfo.y}}>
            <div>State: {hoverInfo.feature.properties.STATE_NAME}</div>
            <div>Average Sentiment: {hoverInfo.feature.properties.sentiment}</div>
            <div>Number of tweets: {hoverInfo.feature.properties.count}</div>
          </div>
        )}
        </>
      }
      </MapGL>
      <ControlPanel year={year} onChange={value => setYear(value)} />
      <Footer />
    </>
  )
}