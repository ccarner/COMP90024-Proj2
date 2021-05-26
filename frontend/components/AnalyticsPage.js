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
import RegressionChart from '../components/RegressionChart';

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

export default function AnalyticsPage({tsData, city, aurinData, regressionVars}) {
  const classes = useStyles();
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
            <LineChart cityData={tsData[city.toLowerCase()]} cityName={city}/>
        </Grid>
        {
          regressionVars.map((name, key) =>(
          <Grid key={key} item>
            <RegressionChart key={key} aurin={aurinData} cityName={city} indepVar={name}/> 
          </Grid>
          ))
          }
      </Container>
      <div className={classes.toolbarMargin} />
      <Footer />
    </>
  );
}