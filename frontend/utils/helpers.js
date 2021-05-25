export function updateData(featureCollection, accessor) {
  const {features} = featureCollection;
  return {
    type: 'FeatureCollection',
    features: features.map(f => {
      const values = accessor(f);
      var curr_sentiment = 0;
      var curr_count = 0;
      var curr_max = 0;
      var curr_min = 0;
      
      if (values){
        curr_sentiment = values.average_sentiment;
        curr_count = values.count;
        curr_max = values.max;
        curr_min = values.min;
      }
      console.log(values);

      const properties = {
        ...f.properties,
        sentiment: curr_sentiment,
        count: curr_count,
        max: curr_max,
        min: curr_min,
      };
      return {...f, properties};
    })
  };
}

export function decimalYearToDateStr(decimal_year){
    const year = Math.floor(decimal_year);
    const decimal = decimal_year - year;
    const week_number = Math.abs(Math.round(decimal * 52));
    return `Week ${week_number + 1} of ${year}`;
}

export function decimalYearToMonthAndWeek(decimal_year){
    const year = Math.floor(decimal_year);
    const decimal = decimal_year - year;
    const week_number = Math.abs(Math.round(decimal * 52));
    return [year, week_number+1];
}

export function getDateOfISOWeek(w, y) {
  var simple = new Date(y, 0, 1 + (w - 1) * 7);
  var dow = simple.getDay();
  var ISOweekStart = simple;
  if (dow <= 4)
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
}

// 
export function combineSuburbData()