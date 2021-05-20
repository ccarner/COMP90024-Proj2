import React, { useEffect, useRef, useState} from 'react';
import { makeStyles } from "@material-ui/core/styles";

import Header from '../components/Header';
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
      <MapBox />
  )
}      