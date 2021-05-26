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
    "housing_stress_30_40_rule":"Housing stress" 
}

const options = {
  scales: {
    y: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

export default function RegressionChart({cityData, lineData, cityName, indepVar}) {
//   console.log(cityData);
   
  const sample_city_data = [{'x':1,'y':1}, {'x':0.5,'y':1.5},{'x':-1, 'y':-1.3}, {'x':2,'y':2}]

  const sample_line_data = [{'x':-4,'y':-4},{'x':5,'y':5}]

  const data = {
    labels: [],
    datasets: [
      {
        label: 'Points',
        data: sample_city_data,
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
        order: 2,
      },
      {
        label: 'Line of best fit',
        data: sample_line_data,
        type: 'line'
      }
    ],
  };

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
    <Scatter data={data} options={options} />
  </>
)
}