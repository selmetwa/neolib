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
      <div className="usa-stars">
        <div className="text">
        <h1>Neoliberalism</h1>
        <h3>A few charts</h3>
        </div>
      </div>
      <Wealth />
      <DoubleChartsWrapper />
      <SingleLineChartsWrapper />
    </div>
  );
}

export default App;
