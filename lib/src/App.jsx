import Wealth from "./charts/Wealth";
import Inequality from "./charts/Inequality";
import SingleLineChartsWrapper from "./SingleChartsWrapper";
import DoubleChartsWrapper from "./DoubleChartsWrapper";
import sources from "./constants/sources";
import neolib from './neolib_art.jpg';
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
      <main>
        <p className='description'>
          Neoliberalism is used to refer to market-oriented
          reform policies such as "eliminating price controls, deregulating
          capital markets, lowering trade barriers" and reducing, especially
          through privatization and austerity, state influence in the economy.{" "}
        </p>
        <Wealth />
        <Inequality />
        <DoubleChartsWrapper />
        <SingleLineChartsWrapper />
      </main>
      <footer>
        <section className="footer-text">
          <div className="footer-text-wrapper">
          <h1>Sources:</h1>
          {sources.map(source => (
            <a href={source.url}>{source.title}</a>
          ))}
          </div>
          <div className="footer-text-img">
          <img src={neolib} />
          </div>
        </section>
      </footer>
    </div>
  );
}

export default App;
