import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import { Container, Grid, Typography, Avatar, Button, makeStyles } from "@material-ui/core";
import LineChart from "../components/Chart";
import MapHeader from "../components/MapHeader";
import Footer from "../components/Footer";
import Head from "next/head";

const useStyles = makeStyles((theme) => ({
  toolbarMargin: {
    ...theme.mixins.toolbar,
    marginBottom: `10em`,
    [theme.breakpoints.down("md")]: {
      marginBottom: "4em",
    },
    [theme.breakpoints.down("xs")]: {
      marginBottom: "2em",
    },
  },
}));

export default function Analytics() {
  const classes = useStyles();
  const [city, setCity] = useState("Melbourne");

  return (
    <>
    <Head>
      <title>
        Analytics by City
      </title>
    </Head>
    <MapHeader currCity={city} changeCityTo={setCity} usage="analytics"/>
      <div className={classes.toolbarMargin} />
      <Container maxWidth="md">
        <Typography
          variant="h1"
          align="center"
          gutterBottom
          style={{ marginBottom: "1em" }}
        >
          {city} Analytics 
        </Typography>
        <Grid
          container
          direction="column"
          alignItems="center"
          spacing={4}
        ></Grid>
        <Grid item>
          <Container maxWidth="sm">
              <LineChart/>
          </Container>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}