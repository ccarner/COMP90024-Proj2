
import * as React from 'react';
import styles from "../styles/ControlPanel.module.css";

function ControlPanel(props) {
  const {year} = props;

  return (
    <div className={styles.controlpanel}>
      <h3>Interactive GeoJSON</h3>
      <p>
        Map showing sentiment by state in year <b>{year}</b>. Hover over a state to
        see details.
      </p>
      <p>
        Data source: <a href="https://aurin.org.au/">AURIN</a>
      </p>
      <hr />

      <div key={'year'} className="input">
        <label>Year</label>
        <input
          type="range"
          value={year}
          min={1995}
          max={2015}
          step={1}
          onChange={evt => props.onChange(evt.target.value)}
        />
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);