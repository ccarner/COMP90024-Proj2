import React, { useEffect, useRef, useState} from 'react';
import { Container, Grid, Typography, Avatar, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import mapboxgl from 'mapbox-gl';
import Layout from '../components/Layout';
import MapBox from '../components/MapBox';

const useStyles = makeStyles((theme) => ({
  btn: {
    background: theme.palette.primary.main,
    color: theme.palette.secondary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  img: {
    width: "100%",
    height: "auto",
    boxShadow: "0px 2px 20px rgba(0,0,0,0.4)",
  },
  main: {
    marginBottom: theme.spacing(4),
  },
}));



export default function Home() {
  const classes = useStyles();
      
  return (
    <Layout title="Cluster and Cloud Computing Project 2" description="COMP">
      {/* <Container maxWidth="md"> */}
        <MapBox />
      {/* </Container> */}
    </Layout>
  )
}      