export const suburbLayer = {
    id: 'suburbs_data',
    type: 'line',
    source: 'suburbs',
    paint: {
      "line-color": "#22B0C0",
      "line-width": 0.5,
      "line-opacity": 1
    }
  };
  
export const stateLayer = {
    id: 'state_data',
    type: 'line',
    source: 'states',
    paint: {
      "line-color": "#22B0C0",
      "line-width": 0.5,
      "line-opacity": 1
    }
  };
  
export const dataLayer = {
    id: 'data',
    type: 'fill',
    paint: {
      'fill-color': {
        property: 'sentiment',
        stops: [
          [0, '#3288bd'],
          [0.04, '#d53e4f'],
          [0.08, '#f46d43'],
          [0.12, '#fdae61'],
          [0.16, '#fee08b'],
          [0.20, '#ffffbf'],
          [0.24, '#e6f598'],
          [0.28, '#abdda4'],
          [0.32, '#66c2a5']
        ]
      },
      'fill-opacity': 0.6
    }
  };