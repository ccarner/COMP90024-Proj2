/*  
COMP90024 Cloud Computing Project 2
  Team 40:
  Mark Drvodelic, 1068574
  Colton Carner, 693280
  Bing Xu, 833684
  Zihao Zhang, 1151006
  Brandon Lulham, 1162377
*/

import { Popup } from "react-map-gl";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import {decimalYearToDateStr, getDateOfISOWeek, decimalYearToMonthAndWeek} from "../utils/helpers";

const cityToState = {
  "Adelaide":"South Australia",
  "Perth":"Western Australia",
  'Melbourne':"Victoria",
  "Sydney":"New South Wales",
  "Brisbane":"Queensland",
 }

const useStyles = makeStyles((theme) =>({
    title: {
        flex: '1 1 100%',
        marginLeft: "15px",
        marginTop: "10px",
        marginBottom: "5px"
        // padding: "0.6em 0 ",
    },
    subtitle:{
        flex: '1 1 100%',
        marginLeft: "15px",
        marginBottom: "25px",
        fontSize: 13,
    },
    error: {
        flex: '1 1 100%',
        marginLeft: "15px",
        marginTop: "5px",
        fontSize: 14,
        color: "red"
    }
}));

function getAbrvDate(date){
  const abrv_year = date.getFullYear() - 2000;
  const day = date.getDate();
  const month = date.getMonth();
  return `${month+1}/${day}/${abrv_year}`;
}

export default function StyledPopup({
  lat,
  long,
  city_name,
  setClickInfo,
  avg_sentiment,
  max_sentiment,
  min_sentiment,
  covidCases,
  covidDeaths,
  year
}) {
    const [curr_year, week_no] = decimalYearToMonthAndWeek(year);
    const classes = useStyles();
    const startDate = getDateOfISOWeek(week_no, curr_year);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    const abrv_date1 = getAbrvDate(startDate);
    const abrv_date2 = getAbrvDate(endDate);
    // console.log(covidCases)
    console.log("Abbreviated start-date:", abrv_date1);
    console.log("Abbreviated end-date:", abrv_date2);
    
    if (city_name in cityToState){
      var cases = 0;
      if (covidCases[cityToState[city_name]][abrv_date2]){
        cases = covidCases[cityToState[city_name]][abrv_date2];
        console.log("Cases: ", cases);
      }
  
      var deaths1 = 0;
      if (covidDeaths[cityToState[city_name]][abrv_date1]){
        deaths1 = covidDeaths[cityToState[city_name]][abrv_date1];
        console.log("Deaths on start date: ", deaths1);
      }
  
      var deaths2 = 0;
      if (covidDeaths[cityToState[city_name]][abrv_date2]){
        deaths2 = covidDeaths[cityToState[city_name]][abrv_date2];
        console.log("Deaths on end date: ", deaths2);
      }
    }

  return (
    <Popup
      latitude={lat}
      longitude={long}
      closeButton={true}
      closeOnClick={true}
      onClose={() => setClickInfo(false)}
      anchor="top"
    >
        <Typography className={classes.title} variant="h5" component="div">
            {city_name}
        </Typography>
        <Typography className={classes.subtitle} variant="h6" component="div">
            {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
        </Typography>
        {avg_sentiment != 0 ? 
      <TableContainer component={Paper}>
        <Table size="small">
        <TableRow>
            <TableHead>
              <TableCell>Average Tweet Sentiment</TableCell>
            </TableHead>
            <TableCell>{avg_sentiment}</TableCell>
          </TableRow>
          <TableRow>
              <TableCell align="right">Highest</TableCell>
            <TableCell>{max_sentiment}</TableCell>
          </TableRow>
          <TableRow>
              <TableCell align="right">Lowest</TableCell>
            <TableCell>{min_sentiment}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>
              <TableCell>COVID-19 Cases (Total)</TableCell>
            </TableHead>
            <TableCell >{cases}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>
              <TableCell>COVID-19 Deaths (Week)</TableCell>
            </TableHead>
            <TableCell >{deaths2 - deaths1}</TableCell>
          </TableRow>
        </Table>
      </TableContainer>
    :         
    <Typography className={classes.error} variant="h6" component="div">
        No data is available for {city_name} in this period.
    </Typography>}
    </Popup>
  );
}
