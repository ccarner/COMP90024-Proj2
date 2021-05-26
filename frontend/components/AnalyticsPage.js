/*  
COMP90024 Cloud Computing Project 2
  Team 40:
  Mark Drvodelic, 1068574
  Colton Carner, 693280
  Bing Xu, 833684
  Zihao Zhang, 1151006
  Brandon Lulham, 1162377
*/
import { Container, Grid, Typography, makeStyles } from "@material-ui/core";
import Footer from "../components/Footer";
import Head from "next/head";
import AnalyticsHeader from "./AnalyticsHeader";
import LineChart from '../components/Chart';
// import RegressionChart from '../components/RegressionChart';


const regressionVars = {
  "melbourne":["housing_stress_30_40_rule", "median_age", "median_weekly_personal_income", "percent_nonreligious", "percent_unemployed", "poverty_rate"],
  "perth":["percent_citizenship","homeless_rate","gini_coefficient","average_life_satisfaction_score"],
  "sydney":["housing_stress_30_40_rule", "median_age", "median_weekly_personal_income", "gini_coefficient","percent_unemployed", "poverty_rate"],
  "brisbane":["housing_stress_30_40_rule","average_life_satisfaction_score"],
  "adelaide":["average_life_satisfaction_score","percent_nonreligious","percent_unemployed","percent_citizenship"],
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

export default function AnalyticsPage({tsData, city}) {
  const classes = useStyles();
  var lowercase_city = city.toLowerCase();
  return (
    <>
    <Head>
      <title>
        Analytics by City
      </title>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </Head>
    <AnalyticsHeader cityName={city}/>
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
          justify="center"
          spacing={0}
        />
        <Grid key={100} item>
            <LineChart cityData={tsData[lowercase_city]} cityName={city}/>
        </Grid>
      </Container>
      <div className={classes.toolbarMargin} />
      <Footer />
    </>
  );
}