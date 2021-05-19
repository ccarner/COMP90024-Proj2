import React, { useEffect, useRef, useState, createRef} from 'react';
import mapboxgl from 'mapbox-gl';



const styles = {
    width: "100vw",
    height: "calc(100vh - 115px)",
    position: "absolute"
  };

export default function MapBox() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(145.11);
    const [lat, setLat] = useState(-37.84);
    const [zoom, setZoom] = useState(9);
        
    useEffect(() => {
        mapboxgl.accessToken = "pk.eyJ1IjoiYmluZ3gxIiwiYSI6ImNrb3ZpdjdmMDA3b28ycG1zczkzc3p2d2YifQ.XI1rQXCzrpvw5qNwSWM5qg"
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: zoom
        });
    });
        
    useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
        setLng(map.current.getCenter().lng.toFixed(4));
        setLat(map.current.getCenter().lat.toFixed(4));
        setZoom(map.current.getZoom().toFixed(2));
        }); 
    });
        
    return (
        <div>
            <div className="map-container" />            
        </div>
    );
 }