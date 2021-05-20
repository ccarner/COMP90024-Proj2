# returns the ISO week of the date
# source: https://weeknumber.com/how-to/javascript
MAP_BY_WEEK = '''function (doc) {
  function getWeek(dateStr) {
    var date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                          - 3 + (week1.getDay() + 6) % 7) / 7);
  }
  
  // Returns the four-digit year corresponding to the ISO week of the date.
  function getWeekYear(dateStr) {
  var date = new Date(dateStr);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  return date.getFullYear();
  }
  
  // get ISO week-year
  const week = getWeek(doc.time);
  const year = getWeekYear(doc.time);
  emit([doc.city, year, week], doc.sentiment, 1);
}'''


MAP_BY_SUBURB = '''function (doc) {
  emit([doc.sa2Name], doc.sentiment, 1);
}'''



# source: https://docs.couchdb.org/en/latest/ddocs/ddocs.html
REDUCE_STATS = '''function(keys, values, rereduce) {
    if (rereduce) {
        return {
            'sum': values.reduce(function(a, b) { return a + b.sum }, 0),
            'min': values.reduce(function(a, b) { return Math.min(a, b.min) }, Infinity),
            'max': values.reduce(function(a, b) { return Math.max(a, b.max) }, -Infinity),
            'count': values.reduce(function(a, b) { return a + b.count }, 0),
            'sumsqr': values.reduce(function(a, b) { return a + b.sumsqr }, 0)
        }
    } else {
        return {
            'sum': sum(values),
            'min': Math.min.apply(null, values),
            'max': Math.max.apply(null, values),
            'count': values.length,
            'sumsqr': (function() {
            var sumsqr = 0;

            values.forEach(function (value) {
                sumsqr += value * value;
            });

            return sumsqr;
            })(),
        }
    }
}
'''
