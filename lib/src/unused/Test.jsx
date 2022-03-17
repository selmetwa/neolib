import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

import LineChart from './LineChart';

const Test = () => {
  const [group, setGroup] = useState('Total');



  const [groups, setGroups] = useState([]);
  const [units, setUnits] = useState([]);
  const [metrics, setMetrics] = useState([]);

  const svg = useRef(null);

  useEffect(() => {
    d3.csv('./data/wealth.csv').then(data => {
      console.log('data: ', data);
      const total = data.filter(d => d['Group'] === group && d['Unit'] === 'Adults');

      setGroups([...new Set(data.map(d => d['Group']))])
      setUnits([...new Set(data.map(d => d['Unit']))])

      let metrics = []
      const notMetrics = ['Group', 'Unit', 'Year', 'Deflator', 'Quarter']
      Object.keys(data[0]).forEach(key => {
        console.log('key: ', key)
        if (!notMetrics.includes(key)) {
          metrics.push(key)
        }
      });

      setMetrics(metrics)

      const chart = new LineChart(total, {
        x: d => d['Year'],
        y: d => d['Total Wealth (nominal $)'] / 10000,
        width: 1200,
        height: 500,
        color: "steelblue"
      });

      svg.current.appendChild(chart)
    })
  }, [group]);

  console.log('groups: ', groups);
  console.log('units: ', units);
  console.log('metrics: ', metrics);

  return (
    <section>
      <select onChange={e => setGroup(e.target.value)}>
        {groups.map(group => (
          <option key={group} value={group}>{group}</option>
        ))}
      </select>
      <select>
        {units.map(unit => (
          <option key={unit} value={unit}>{unit}</option>
        ))}
      </select>
      <select>
        {metrics.map(metric => (
          <option key={metric} value={metric}>{metric}</option>
        ))}
      </select>
      <div ref={svg}></div>
    </section>
  )
}

export default Test