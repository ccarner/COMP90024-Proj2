# Frontend

This folder contains the code for the web application used to display the data collected. 

The home page serves an interactive map displaying sentiment at varying levels of granularity (state -> suburb). 

For state-level sentiment data, a control panel will appear to allow the user to adjust which period of time they would like the map to display sentiment for.

## Data 
Data is pulled from AURIN and CouchDB (which is being fed tweets from a running twitter harvester). This data is then displayed in the frontend. 

## Getting Started

First, install the project related dependencies. Make sure you are in the `/frontend` folder, and run the following in your terminal:
```bash
yarn install
```

Then, start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.