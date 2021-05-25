
import * as React from 'react';
import styles from "../styles/ControlPanel.module.css";
import {decimalYearToDateStr, getDateOfISOWeek, decimalYearToMonthAndWeek} from "../utils/helpers";

function ControlPanel(props) {
  const {year, setClickInfo, city} = props;
  const [curr_year, week_no] = decimalYearToMonthAndWeek(year);
  const startDate = getDateOfISOWeek(week_no, curr_year);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 7);

  const DateString = `${decimalYearToDateStr(year)}, ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
  console.log("Control panel - city:", city);
  return (
    <div className={styles.controlpanel}>
      <h3>{city}</h3>
      <h4>Interactive GeoJSON</h4>
      <p>
        Map showing sentiment by {city != "All States" ? "suburb": "state"} in <b>{city == "All States" ? DateString : "2020 - 2021"}</b>. Hover over a {city != "All States" ? "suburb": "state"} to
        see details. 
      </p>
      <p>
        Data source: <a href="https://aurin.org.au/">AURIN</a>
      </p>
      <hr />
      { city == "All States" ?
      <div key={'year'} className={styles.input}>
        <label className={styles.label}>Date</label>
        <input
          type="range"
          value={year}
          min={2020}
          max={2021.28}
          step={1/52}
          onChange={evt => {
            props.onChange(evt.target.value);
            setClickInfo(false);
          }}
        />
      </div>
      :
      <div/> 
      }
    </div>
  );
}

export default React.memo(ControlPanel);