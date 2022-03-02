import Wealth from "./charts/Wealth";
import Inequality from "./charts/Inequality";
import SingleLineChart from "./charts/SingleLineChart";
import DoubleLineChart from "./charts/DoubleLineChart";
import singleLineCharts from "./constants/singleCharts";
import doubleCharts from './constants/doubleCharts';
import ServiceManufactor from './charts/ServiceManufactor';
import SingleLineChartsWrapper from "./SingleChartsWrapper";
import "./App.css";

function App() {
  return (
    <div className='App'>
      <Wealth />
      <Inequality />
      {doubleCharts.map((obj) => {
        const {title, time, fileName, lineOne, lineTwo, lineOneName, lineTwoName} = obj;
        return <DoubleLineChart {...{title, time, fileName, lineOne, lineTwo, lineOneName, lineTwoName }} />
      })}
      <ServiceManufactor />

      <SingleLineChartsWrapper />
      {/* {singleLineCharts.map((obj) => {
        const {title, fileName, time, yValue} = obj;
        return <SingleLineChart {...{title, fileName, time, yValue}} />
      })} */}
    </div>
  );
}

export default App;
