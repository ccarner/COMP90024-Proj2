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

const coords = {
    "Adelaide":{lat: -34.93, long: 138.6},
    "Perth":{lat: -31.95, long: 115.86},
    "Melbourne":{lat:-37.84, long: 145.11},
    "Sydney":{lat: -33.87, long: 151.21},
    "Brisbane":{lat: -27.47, long: 153.02},
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

export default function SuburbPopup({
  lat,
  long,
  setClickInfo,
  feature_props,
  city_name,
}) {
    const classes = useStyles();
  return (
    <Popup
      latitude={coords[city_name].lat}
      longitude={coords[city_name].long}
      closeButton={true}
      closeOnClick={true}
      onClose={() => setClickInfo(false)}
      anchor="top"
    >
        <Typography className={classes.title} variant="h5" component="div">
            {feature_props["SA2 Name"]}
        </Typography>
        <Typography className={classes.subtitle} variant="h6" component="div">
            {city_name}
        </Typography>
        {feature_props.sentiment != 0 ? 
      <TableContainer component={Paper}>
        <Table size="small">
        <TableRow>
            <TableHead>
              <TableCell>Average Tweet Sentiment</TableCell>
            </TableHead>
            <TableCell>{feature_props.sentiment}</TableCell>
          </TableRow>
        </Table>
      </TableContainer>
    :         
    <Typography className={classes.error} variant="h6" component="div">
        No data is available for {feature_props["SA2 Name"]} in this period.
    </Typography>}
    </Popup>
  );
}
