/*  
COMP90024 Cloud Computing Project 2
  Team 40:
  Mark Drvodelic, 1068574
  Colton Carner, 693280
  Bing Xu, 833684
  Zihao Zhang, 1151006
  Brandon Lulham, 1162377
*/

import React, {useState, useMemo, useCallback} from "react";
import MapHeader from "./MapHeader";
import Footer from "./Footer";
import Head from "next/head";
import MapGL, {FlyToInterpolator, Source, Layer, Popup} from 'react-map-gl';
import ControlPanel from "./ControlPanel";
import {updateData, decimalYearToMonthAndWeek} from "../utils/helpers";
import styles from "../styles/MapBox.module.css";
import {stateLayer, suburbLayer, dataLayer, suburbdataLayer} from "./MapStyles";
import StyledPopup from "./Popup";
import SuburbPopup from "./SuburbPopup";

const coords = {
 "South Australia":{lat: -34.93, long: 138.6, city:'Adelaide'},
 "Western Australia":{lat: -31.95, long: 115.86, city:'Perth'},
 "Victoria":{lat:-37.84, long: 145.11, city:'Melbourne'},
 "New South Wales":{lat: -33.87, long: 151.21, city:'Sydney'},
 "Queensland":{lat: -27.47, long: 153.02, city:'Brisbane'},
 "Northern Territory":{lat: -19.49, long:132.55, city:'Darwin'}
}

export default function MapBox({suburbData, cityData,suburbOn, activateSuburbs, covidCases, covidDeaths}) {
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
  const [year, setYear] = useState(2020);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [clickInfo, setClickInfo] = useState(null);

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

  const onClick = useCallback(event => {
    const {
      features,
      srcEvent: {offsetX, offsetY}
    } = event;
    const clickedFeature = features && features[0];
    console.log(clickedFeature, features[0]);
    setClickInfo(
      clickedFeature
        ? {
            feature: clickedFeature,
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

  console.log(covidCases);

  return (
    <>
      <Head>
        <title>
          "COMP90024"
        </title>
      </Head>
      <MapHeader goToCoord={goTo} currCity={city} changeCityTo={setCity} usage={"map"} setSuburbOn={activateSuburbs} setClickInfo={setClickInfo}/>
      <MapGL
        {...viewport}
        width="100vw"
        height="100vh"
        mapStyle="mapbox://styles/shijiel2/cjvcb640p3oag1gjufck6jcio"
        onViewportChange={setViewport}
        mapboxApiAccessToken={process.env.MAPBOX_API_TOKEN}
        interactiveLayerIds={['data']}
        onHover={onHover}
        onClick={onClick}
      >
        {suburbOn ?
        <>       
        <Source key={1} id="suburbs" type="geojson" data={suburbData}>
          <Layer {...suburbLayer} />
        </Source>
        <Source key={4} id="suburbs-fill" type="geojson" data={suburbData}>
          <Layer {...suburbdataLayer} />
        </Source>
        {hoverInfo && (
          <div className={styles.tooltip} style={{left: hoverInfo.x, top: hoverInfo.y}}>
            <div>Suburb: {hoverInfo.feature.properties.sa2_name}</div>
            <div>Average Sentiment: {(hoverInfo.feature.properties.sentiment).toFixed(3)}</div>
            <div>Number of tweets: {hoverInfo.feature.properties.counts}</div>
          </div>
        )}
        {clickInfo && <SuburbPopup 
        lat={viewport.latitude}
        long={viewport.longitude}
        setClickInfo={setClickInfo}
        feature_props={clickInfo.feature.properties}
        city_name={city}
        />} 
        </>
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
            <div>Average Sentiment: {(hoverInfo.feature.properties.sentiment).toFixed(3)}</div>
            <div>Number of tweets: {hoverInfo.feature.properties.count}</div>
          </div>
        )}
        {clickInfo && <StyledPopup 
        lat={coords[clickInfo.feature.properties.STATE_NAME].lat}
        long={coords[clickInfo.feature.properties.STATE_NAME].long}
        setClickInfo={setClickInfo}
        city_name = {coords[clickInfo.feature.properties.STATE_NAME].city}
        covidCases={covidCases}
        covidDeaths={covidDeaths}
        weekly_cases={10}
        weekly_deaths={6}
        avg_sentiment={clickInfo.feature.properties.sentiment.toFixed(3)}
        max_sentiment={clickInfo.feature.properties.max.toFixed(3)}
        min_sentiment={clickInfo.feature.properties.min.toFixed(3)}
        year={year}
        />}
        </>
      }
      </MapGL>
      <ControlPanel year={year} onChange={value => setYear(value)} setClickInfo={setClickInfo} city={city}/>
      <Footer />
    </>
  )
}