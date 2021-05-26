/*  
COMP90024 Cloud Computing Project 2
  Team 40:
  Mark Drvodelic, 1068574
  Colton Carner, 693280
  Bing Xu, 833684
  Zihao Zhang, 1151006
  Brandon Lulham, 1162377
*/

import { ContactPhoneOutlined } from '@material-ui/icons';
import React from 'react';
import { Scatter } from 'react-chartjs-2';
import {linearRegression, regress} from '../utils/helpers';

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
        },
      },
    ],
    xAxes: [{
        type: 'linear',
        position: '',
        display: true,
        text: "Haha"
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

  const x_data = aurin[lowercase_city].map(r => (r[indepVar]));

  const y_data = aurin[lowercase_city].map(r => (r["sentiment"]));

  // console.log("x data", x_data);
  // console.log("y data", y_data);
//   const linear_reg = linearRegression(y_data, x_data);

  const linear_reg = regress(x_data, y_data);

  // console.log("Regression output:", linear_reg);

  const x_min = Math.min(...x_data);

  const x_max = Math.max(...x_data);

  // console.log("min x", x_min);
  // console.log("max x", x_max);

  const point1 = {
      'x': x_min, 
      'y': x_min * linear_reg["slope"] + linear_reg["intercept"]
    }

  const point2 = {
      'x': x_max,
      'y': x_max * linear_reg["slope"] + linear_reg["intercept"]
    };

  const line_data = [point1, point2];

  console.log("Line data", line_data);

  const data = {
    labels: [],
    datasets: [
      {
        label: 'Points',
        data: pointCityData,
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
        order: 2,
      },
      {
        label: 'Line of best fit',
        data: line_data,
        type: 'line',
        fill: false,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgba(54, 162, 235, 0.2)',
        Opacity: 0.5,
        order: 1,
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
    <Scatter data={data} options={options}/>
  </>
)
}