import Wealth from "./Wealth";
import Inequality from "./Inequality";
import SingleLineChart from "./SingleLineChart";
import DoubleLineChart from "./DoubleLineChart";
import singleLineCharts from "./singleCharts";
import doubleCharts from './doubleCharts';
import ServiceManufactor from './ServiceManufactor'
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

      {singleLineCharts.map((obj) => {
        const {title, fileName, time, yValue} = obj;
        return <SingleLineChart {...{title, fileName, time, yValue}} />
      })}
    </div>
  );
}

export default App;
