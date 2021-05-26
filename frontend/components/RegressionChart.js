/*  
COMP90024 Cloud Computing Project 2
  Team 40:
  Mark Drvodelic, 1068574
  Colton Carner, 693280
  Bing Xu, 833684
  Zihao Zhang, 1151006
  Brandon Lulham, 1162377
*/

import React from 'react';
import { Scatter } from 'react-chartjs-2';

const translations = {
    "median_age":"Age (Median)",
    "population":"Population",
    "median_weekly_personal_income":"Weekly income (Median)",
    "poverty_rate":"Poverty rate (%)",
    "percent_unemployed":"Unemployment rate (%)",
    "homeless_rate":"Homeless rate (%)",
    "percent_nonreligious":"Non-religious rate (%)",
    "housing_stress_30_40_rule":"Housing stress",
    "percent_citizenship":"Citizenship (%)",
    "average_life_satisfaction_score":"Life satisfaction score (Average)",
    "gini_coefficient":"Gini coefficient"
}

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: false,
          min: -0.5,
          max: 0.5
        },
      },
    ],
    xAxes: [{
        type: 'linear',
        position: 'bottom'
    }]
  },
};


export default function RegressionChart({aurin, cityName, indepVar}) {
//   console.log(cityData);
   
  const sample_city_data = [{'x':1,'y':1}, {'x':0.5,'y':1.5},{'x':-1, 'y':-1.3}, {'x':2,'y':2}]

  const sample_line_data = [{'x':1,'y':0.2},{'x':0,'y':0}]

  var lowercase_city = cityName.toLowerCase();

  const pointCityData = aurin[lowercase_city].map(d => {
    return {'x': d[indepVar], 'y': d["sentiment"]}
  })

  console.log("Sample Data: ", sample_city_data);

  console.log("Actual data: ", pointCityData);

  const data = {
    labels: [],
    datasets: [
      {
        label: 'Points',
        data: pointCityData,
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Line of best fit',
        data: sample_line_data,
        type: 'line'
      }
    ],
  };

  console.log(data);

return (
  <>
    <div className='header'>
      <h1 className='title'>Sentiment vs. {translations[indepVar]}</h1>
      <div>
        <a>
          This chart displays a partial regression of sentiment against {translations[indepVar]} in {cityName}.
          The average tweet sentiment is calculated based on tweets harvested by the cluster geotagged to each suburb. The by-suburb economic data is retrieved from AURIN.
        </a>
      </div>
      <br></br>
      <div className='links'>
        <a>
          Source: <a href="https://aurin.org.au/">AURIN</a>
        </a>
      </div>
    </div>
    <Scatter data={data}/>
  </>
)
}