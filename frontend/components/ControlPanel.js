
import * as React from 'react';
import styles from "../styles/ControlPanel.module.css";
import {decimalYearToDateStr} from "../utils/helpers";

function ControlPanel(props) {
  const {year} = props;

  return (
    <div className={styles.controlpanel}>
      <h3>Interactive GeoJSON</h3>
      <p>
        Map showing sentiment by state in <b>{decimalYearToDateStr(year)}</b>. Hover over a state to
        see details.
      </p>
      <p>
        Data source: <a href="https://aurin.org.au/">AURIN</a>
      </p>
      <hr />

      <div key={'year'} className="input">
        <label>Date</label>
        <input
          type="range"
          value={year}
          min={2020}
          max={2021.28}
          step={1/52}
          onChange={evt => props.onChange(evt.target.value)}
        />
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);