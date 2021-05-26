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
import {regress} from '../utils/helpers';
import dynamic from 'next/dynamic'

const Scatter = dynamic(() => import("react-chartjs-2").then((mod) => mod.Scatter), {ssr: false});

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

  var lowercase_city = cityName.toLowerCase();

  const pointCityData = aurin[lowercase_city].map(d => {
    return {'x': d[indepVar], 'y': d["sentiment"]}
  })

  const x_data = aurin[lowercase_city].map(r => (r[indepVar]));

  const y_data = aurin[lowercase_city].map(r => (r["sentiment"]));

  const linear_reg = regress(x_data, y_data);

  const x_min = Math.min(...x_data);
  const x_max = Math.max(...x_data);

  const point1 = {
      'x': x_min, 
      'y': x_min * linear_reg["slope"] + linear_reg["intercept"]
    }
  const point2 = {
      'x': x_max,
      'y': x_max * linear_reg["slope"] + linear_reg["intercept"]
    };
  const line_data = [point1, point2];
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