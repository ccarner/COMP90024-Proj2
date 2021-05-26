import {getTimeSeriesData, getAURINDataForAnalysis} from '../../utils/dataloaders';
import AnalyticsPage from '../../components/AnalyticsPage';

export async function getStaticProps(context) {
    console.log("Fetching time series data for analytics for Melbourne")
  
    const all_timeseries = getTimeSeriesData();
  
    let aurin = getAURINDataForAnalysis();
  
    return {
      props: {tsData: all_timeseries, aurinData: aurin} 
    }
  }

export default function AnalyticsHome({tsData, aurinData}) {
    const vars = ["housing_stress_30_40_rule", "median_age", "median_weekly_personal_income", "percent_nonreligious", "percent_unemployed", "poverty_rate"];
    return (
        <AnalyticsPage city="Melbourne" tsData={tsData} aurinData={aurinData} regressionVars={vars}/>
    )
}