export function updateData(featureCollection, accessor) {
  const {features} = featureCollection;
  return {
    type: 'FeatureCollection',
    features: features.map(f => {
      const value = accessor(f);
      const properties = {
        ...f.properties,
        value,
        percentile: scale(value)
      };
      return {...f, properties};
    })
  };
}

export function decimalYearToDate(decimal_year){
    const year = Math.floor(decimal_year);
    const decimal = decimal_year - year;
    console.log(year, decimal);

    const week_number = Math.abs(Math.round(decimal * 52));
    
    return `Week ${week_number} of ${year}`;
}