/*  
COMP90024 Cloud Computing Project 2
  Team 40:
  Mark Drvodelic, 1068574
  Colton Carner, 693280
  Bing Xu, 833684
  Zihao Zhang, 1151006
  Brandon Lulham, 1162377
*/
import {getTimeSeriesData, getAURINDataForAnalysis} from '../../utils/dataloaders';
import AnalyticsPage from '../../components/AnalyticsPage';

export async function getStaticProps(context) {
    console.log("Fetching time series data for analytics for Adelaide")
  
    const all_timeseries = getTimeSeriesData();
  
    let aurin = getAURINDataForAnalysis();
  
    return {
      props: {tsData: all_timeseries, aurinData: aurin} 
    }
  }

export default function AnalyticsHome({tsData, aurinData}) {
    const vars = ["average_life_satisfaction_score","percent_nonreligious","percent_unemployed","percent_citizenship"];
    return (
        <AnalyticsPage city="Adelaide" tsData={tsData} aurinData={aurinData} regressionVars={vars}/>
    )
}