import Wealth from "./charts/Wealth";
import Inequality from './charts/Inequality'
import SingleLineChartsWrapper from "./SingleChartsWrapper";
import DoubleChartsWrapper from "./DoubleChartsWrapper";
import "./App.css";

function App() {
  return (
    <div className='App'>
      <div className='usa-stars'>
        <div className='text'>
          <h1>Neoliberalism</h1>
          <h3>A few charts</h3>
        </div>
      </div>
      <p className='description'>
        Neoliberalism is contemporarily used to refer to market-oriented reform
        policies such as "eliminating price controls, deregulating capital
        markets, lowering trade barriers" and reducing, especially through
        privatization and austerity, state influence in the economy.{" "}
      </p>
      <Wealth />
      <Inequality />
      <DoubleChartsWrapper />
      <SingleLineChartsWrapper />
    </div>
  );
}

export default App;
