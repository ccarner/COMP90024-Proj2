/*  
COMP90024 Cloud Computing Project 2
  Team 40:
  Mark Drvodelic, 1068574
  Colton Carner, 693280
  Bing Xu, 833684
  Zihao Zhang, 1151006
  Brandon Lulham, 1162377
*/

import React, { useEffect, useRef, useState } from "react";
import { Container, Grid, Typography, Avatar, Button, makeStyles } from "@material-ui/core";
import MapHeader from "../components/MapHeader";
import Footer from "../components/Footer";
import Head from "next/head";
import Image from "next/image";
import LineChart from "../components/Chart";

const analytics_routes = {
  "melbourne":["melbourne_time_series", "housing_stress_30_40_rule_partial_regression", "median_age_partial_regression", "median_weekly_personal_income_partial_regression", "percent_nonreligious_partial_regression", "percent_unemployed_partial_regression", "poverty_rate_partial_regression"],
  "perth":["perth_time_series","percent_citizenship_partial_regression","homeless_rate_partial_regression","gini_coefficient_partial_regression","average_life_satisfaction_score_partial_regression"],
  "sydney":["sydney_time_series", "housing_stress_30_40_rule_partial_regression", "median_age_partial_regression", "median_weekly_personal_income_partial_regression", "gini_coefficient_partial_regression","percent_unemployed_partial_regression", "poverty_rate_partial_regression"],
  "brisbane":["brisbane_time_series", "housing_stress_30_40_rule_partial_regression","average_life_satisfaction_score_partial_regression"],
  "adelaide":["adelaide_time_series","average_life_satisfaction_score_partial_regression","percent_nonreligious_partial_regression","percent_unemployed_partial_regression","percent_citizenship_partial_regression"],
  "all states":[]
};

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

  var lowercase_city = city.toLowerCase();
  // console.log(analytics_routes[lowercase_city]);
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
          // direction="column"
          // alignItems="center"
          justify="center"
          spacing={0}
        />
        {/* <Grid key={100} item>
          <LineChart cityName={city}/>
        </Grid> */}
        {
          analytics_routes[lowercase_city].map((name, key) =>(
          <Grid key={key} item>
            <Container>
                <Image src={`/${lowercase_city}/${name}.png`} width={13.5} height={7.9} layout="responsive"/>
            </Container>
          </Grid>
          ))
        }
      </Container>
      <div className={classes.toolbarMargin} />
      <Footer />
    </>
  );
}