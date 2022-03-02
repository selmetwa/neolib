import singleLineCharts from "./constants/singleCharts";
import SingleLineChart from "./charts/SingleLineChart";

import "./singleCharts.css";

const SingleLineChartsWrapper = () => (
  <section className='singleCharts'>
    {singleLineCharts.map((obj, i) => {
      const { title, fileName, time, yValue } = obj;
      console.log('i: ', i)
      const color = i === 0 || i === 3 ? 'dark' : 'light'
      return (
        <div className={`chart ${color}`}>
          <SingleLineChart {...{ title, fileName, time, yValue }} />
        </div>
      );
    })}
  </section>
);

export default SingleLineChartsWrapper;
