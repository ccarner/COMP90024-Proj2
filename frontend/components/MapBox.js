import React, { useEffect, useRef, useState, createRef } from "react";
import mapboxgl from "mapbox-gl";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import MapHeader from "./MapHeader";
import Footer from "./Footer";
import Head from "next/head";
 
const map_styles = {
  // width: "100vw",
  height: "100vh",
  // position: "relative"
};

export default function MapBox() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(145.11);
  const [lat, setLat] = useState(-37.84);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYmluZ3gxIiwiYSI6ImNrb3ZpdjdmMDA3b28ycG1zczkzc3p2d2YifQ.XI1rQXCzrpvw5qNwSWM5qg";
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/shijiel2/cjvcb640p3oag1gjufck6jcio",
      center: [lng, lat],
      zoom: zoom,
      attributionControl: false,
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return (
    <>
      <Head>
        <title>
          "COMP90024"
        </title>
      </Head>
      <MapHeader/>
      <div ref={mapContainer} className="map-container" style={map_styles} />
      <Footer />
    </>
  )
}