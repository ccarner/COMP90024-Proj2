import { Popup } from "react-map-gl";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import {decimalYearToDateStr, getDateOfISOWeek, decimalYearToMonthAndWeek} from "../utils/helpers";

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

export default function StyledPopup({
  lat,
  long,
  weekly_cases,
  weekly_deaths,
  city_name,
  setClickInfo,
  avg_sentiment,
  max_sentiment,
  min_sentiment,
  year
}) {
    const [curr_year, week_no] = decimalYearToMonthAndWeek(year);
    const classes = useStyles();
    const startDate = getDateOfISOWeek(week_no, curr_year);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

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
              <TableCell>COVID-19 Cases</TableCell>
            </TableHead>
            <TableCell>{weekly_cases}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>
              <TableCell>COVID-19 Deaths</TableCell>
            </TableHead>
            <TableCell>{weekly_deaths}</TableCell>
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
