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
import { Line } from 'react-chartjs-2';



const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
    xAxes: [{
      type: 'time',
      // distribution: 'linear',
      time: {
        displayFormats: {
          day: 'MMM D',
          week: 'MMM YYYY',
          month: 'MMM YYYY',
          quarter:  'MMM YYYY'
        }
      }
    }]
  },
};

export default function LineChart({cityData, cityName}) {
  console.log(cityData);

  const data = {
    labels: [],
    datasets: [
      {
        label: 'Average Sentiment',
        data: cityData,
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

return (
  <>
    <div className='header'>
      <h1 className='title'>Average Tweet Sentiment</h1>
      <div className='links'>
        <a
          className='btn btn-gh'
          href='https://github.com/reactchartjs/react-chartjs-2/blob/master/example/src/charts/Line.js'
        >
          January 2020 - April 2021
        </a>
      </div>
    </div>
    <Line data={data} options={options} />
  </>
)
}