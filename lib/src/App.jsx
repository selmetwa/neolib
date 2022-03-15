import Wealth from "./charts/Wealth";
import Inequality from "./charts/Inequality";
import SingleLineChart from "./charts/SingleLineChart";
import DoubleLineChart from "./charts/DoubleLineChart";
import singleLineCharts from "./constants/singleCharts";
import doubleCharts from './constants/doubleCharts';
import ServiceManufactor from './charts/ServiceManufactor';
import SingleLineChartsWrapper from "./SingleChartsWrapper";
import DoubleChartsWrapper from "./DoubleChartsWrapper";
import "./App.css";

function App() {
  return (
    <div className='App'>
      <Wealth />
      <DoubleChartsWrapper />
      <SingleLineChartsWrapper />
    </div>
  );
}

export default App;
