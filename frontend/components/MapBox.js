import React, {useState, useMemo, useCallback} from "react";
import MapHeader from "./MapHeader";
import Footer from "./Footer";
import Head from "next/head";
import MapGL, {FlyToInterpolator, Source, Layer, Popup} from 'react-map-gl';
import ControlPanel from "./ControlPanel";
import {updateData, decimalYearToMonthAndWeek} from "../utils/helpers";
import styles from "../styles/MapBox.module.css";
import {stateLayer, suburbLayer, dataLayer} from "./MapStyles";

const coords = {
 "South Australia":{lat: -34.93, long: 138.6},
 "Western Australia":{lat: -31.95, long: 115.86},
 "Victoria":{lat:-37.84, long: 145.11},
 "New South Wales":{lat: -33.87, long: 151.21},
 "Queensland":{lat: -27.47, long: 153.02},
 "Northern Territory":{lat: -19.49, long:132.55}
}

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
        onClick={onClick}
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
            <div>Average Sentiment: {(hoverInfo.feature.properties.sentiment).toFixed(3)}</div>
            <div>Number of tweets: {hoverInfo.feature.properties.count}</div>
          </div>
        )}
        {clickInfo && <Popup
          latitude={coords[clickInfo.feature.properties.STATE_NAME].lat}
          longitude={coords[clickInfo.feature.properties.STATE_NAME].long}
          closeButton={true}
          closeOnClick={true}
          onClose={() => setClickInfo(false)}
          anchor="top" >
          <div>You clicked on {clickInfo.feature.properties.STATE_NAME}</div>
        </Popup>}
        </>
      }
      </MapGL>
      <ControlPanel year={year} onChange={value => setYear(value)} />
      <Footer />
    </>
  )
}