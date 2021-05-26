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

export function combineSuburbWithAurin(suburb_data, aurin_data){
  for (var i =0; i< suburb_data.features.length; i++){
    // console.log(suburb_data.features[i]);
    // Suburb code
    var suburb_id = suburb_data["features"][i]["properties"]["sa2_mainc0"];
    var aurin_props;
    if (!(suburb_id in aurin_data)){
      // console.log(suburb_id, " is not in AURINN Data");
      aurin_props = {sentiment: 0, counts: 0}
    }
    else{
      aurin_props = aurin_data[suburb_id];
    }
    // console.log(aurin_data[suburb_id]);
    // Variables to read in 
    var properties = {
      ...suburb_data["features"][i].properties,
      ...aurin_props
    };
    suburb_data["features"][i]["properties"] = properties;
    // console.log(suburb_data.features[i]);
  }
  return suburb_data;
}

export function linearRegression(y,x){
  var lr = {};
  var n = y.length;
  var sum_x = 0;
  var sum_y = 0;
  var sum_xy = 0;
  var sum_xx = 0;
  var sum_yy = 0;

  for (var i = 0; i < y.length; i++) {

      sum_x += x[i];
      sum_y += y[i];
      sum_xy += (x[i]*y[i]);
      sum_xx += (x[i]*x[i]);
      sum_yy += (y[i]*y[i]);
  } 

  lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
  lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
  lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

  return lr;
}

export const regress = (x, y) => {
  const n = y.length;
  let sx = 0;
  let sy = 0;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
      sx += x[i];
      sy += y[i];
      sxy += x[i] * y[i];
      sxx += x[i] * x[i];
      syy += y[i] * y[i];
  }
  const mx = sx / n;
  const my = sy / n;
  const yy = n * syy - sy * sy;
  const xx = n * sxx - sx * sx;
  const xy = n * sxy - sx * sy;
  const slope = xy / xx;
  const intercept = my - slope * mx;
  const r = xy / Math.sqrt(xx * yy);
  const r2 = Math.pow(r,2);
  let sst = 0;
  for (let i = 0; i < n; i++) {
     sst += Math.pow((y[i] - my), 2);
  }
  const sse = sst - r2 * sst;
  const see = Math.sqrt(sse / (n - 2));
  const ssr = sst - sse;
  return {slope, intercept, r, r2, sse, ssr, sst, sy, sx, see};
}