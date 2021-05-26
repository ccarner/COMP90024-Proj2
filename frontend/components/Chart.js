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
// import { Line } from 'react-chartjs-2';
import dynamic from 'next/dynamic'

const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {ssr: false});


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
      <div>
        <a>
          This chart displays how sentiment has changed over time in {cityName}.
          The average tweet sentiment is calculated based on tweets harvested by the cluster in the week (starting from the dates below).
        </a>
      </div>
      <br></br>
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