import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

import "../wealth.css";

const Inequality = () => {
  const [unit, setUnit] = useState('Adults');
  const [metric, setMetric] = useState('Total Pretax Income (nominal $)');

  const [activeGroups, setGroups] = useState(['Top 0.01%', 'Top 0.1%', 'Top 1%', 'Top 10%', 'Middle 40%', 'Bottom 50%'])
  const groups = ['Top 0.01%', 'Top 0.1%', 'Top 1%', 'Top 10%', 'Middle 40%', 'Bottom 50%']

  const [colors] = useState({
    // 'Total': 'red',
    'Top 0.01%': 'blue',
    'Top 1%': 'green',
    'Top 10%': 'purple',
    'Bottom 50%': 'orange',
    'Middle 40%': 'brown',
    'Top 0.1%': 'black'
  })

  const svgRef = useRef();

  const destroyPreviousChart = () => {
    var svg = d3.select(".inequality-chart");
    svg.selectAll("*").remove();
  }

  const handleUpdateCheckboxes = (e) => {
    destroyPreviousChart();
    const existing = [...activeGroups];

    const index = existing.indexOf(e.target.value);
    if (index > -1) {
      existing.splice(index, 1); // 2nd parameter means remove one item only
    } else {
      existing.push(e.target.value);
    }
    setGroups(existing);
  };

  const handleUpdateUnit = (e) => {
    destroyPreviousChart();
    setUnit(e.target.value);
  };

  const handleUpdateShare = (e) => {
    destroyPreviousChart();
    setMetric(e.target.value);
  };

  useEffect(() => {
    d3.csv('./public/inequality.csv').then(data => {
      let intViewportWidth = window.innerWidth;

      const w = intViewportWidth / 2;
      const h = window.innerHeight / 1.5;

      const all = data.map(d => d[metric])
      const total = data.filter(d => d['Group'] === 'Total' && d['Unit'] === unit).map(d => d[metric])
      const topTenPercent = data.filter(d => d['Group'] === 'Top 10%' && d['Unit'] === unit).map(d => Number(d[metric]))
      const topOnePercent = data.filter(d => d['Group'] === 'Top 1%' && d['Unit'] === unit).map(d =>  Number(d[metric]))
      const top0PointOnePercent = data.filter(d => d['Group'] === 'Top 0.1%' && d['Unit'] === unit).map(d =>  Number(d[metric]))
      const topOneTenthOfOnePercent = data.filter(d => d['Group'] === 'Top 0.01%' && d['Unit'] === unit).map(d =>  Number(d[metric]))
      const middleFourtyPercent = data.filter(d => d['Group'] === 'Middle 40%' && d['Unit'] === unit).map(d =>  Number(d[metric]))
      const bottomFiftyPercent = data.filter(d => d['Group'] === 'Bottom 50%' && d['Unit'] === unit).map(d =>  Number(d[metric]))

      console.log('all: ', all)
      console.log('min all: ', d3.min(all));
      console.log('max all: ', d3.max(all));

      const groups = [
        { group: topOneTenthOfOnePercent, color: 'blue', name: 'Top 0.01%' },
        { group: topOnePercent, color: 'red', name: 'Top 1%' },
        { group: topTenPercent, color: 'green', name: 'Top 10%' },
        { group: bottomFiftyPercent, color: 'orange', name: 'Bottom 50%' },
        { group: middleFourtyPercent, color: 'yellow', name: 'Middle 40%' },
        { group: top0PointOnePercent, color: 'black', name: 'Top 0.1%' },
      ]

      const groupsToRender = groups.filter(g => activeGroups.includes(g.name))
      const groupsToRenderData = groupsToRender.map(g => [...g.group]).flat()

      const svg = d3.select(svgRef.current)
        .attr('width', w)
        .attr('height', h)
        .style('background', '#f5f5f5')
        .style('margin-top', '50')
        .style('margin-bottom', '50')
        .style('overflow', 'visible')


      const xScale = d3.scaleLinear()
        .domain([0, total.length - 1])
        .range([0, w])

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(groupsToRenderData)])
        .range([h, 0])

      const generateScaledLine = d3.line()
        .x((d, i) => xScale(i))
        .y(yScale)
        .curve(d3.curveCardinal)

      // setting the axes
      const xAxis = d3.axisBottom(
        d3.scaleLinear()
          .domain([1976, 2021])
          .range([0, w])
      )
        .ticks(15)
        .tickFormat(i => i + 1)

      const yAxis = d3.axisLeft(yScale)
        .ticks(20)

      svg.append('g')
        .call(yAxis)
      svg.append('g')
        .call(xAxis)
        .attr('transform', `translate(0, ${h})`)

      groupsToRender.forEach((group, i) => {
        svg.selectAll('.line')
          .data([group.group])
          .join('path')
          .attr('d', d => generateScaledLine(d))
          .attr('fill', 'none')
          .attr('stroke', colors[group.name])
          .attr("stroke-width", 1.5)
      })
    })
  }, [unit, metric, activeGroups])

  return (
    <section className='wrapper'>
    <svg ref={svgRef} className="inequality-chart"></svg>
    <aside className='aside'>
      <div className='aside-text'>
        <h1>Wealth Growth</h1>
        <h3>From 1976 to 2021</h3>
      </div>
      <div className='selects'>
        <select onChange={handleUpdateUnit}>
          <option value={"Adults"}>Adults</option>
          <option value={"Households"}>Households</option>
        </select>
        <select onChange={handleUpdateShare}>
          <option value={"Total Pretax Income (nominal $)"}>
          Total Pretax Income (nominal $)
          </option>
          <option value={"Factor Income Per Unit (nominal $)"}>Factor Income Per Unit (nominal $)</option>
          <option value={"Disposable Income Per Unit (nominal $)"}>Disposable Income Per Unit (nominal $)</option>
          <option value={"Total Disposable Income (nominal $)"}>Total Disposable Income (nominal $)</option>
        </select>
      </div>

      <div className='checkboxes'>
        {groups.map((group) => {
          const isChecked = activeGroups.includes(group);
          return (
            <div key={group} className='checkbox'>
              <input
                type='checkbox'
                checked={isChecked}
                value={group}
                onChange={handleUpdateCheckboxes}
              />
              <div
                className='circle'
                style={{ backgroundColor: colors[group] }}
              />
              <label htmlFor='scales'>{group}</label>
            </div>
          );
        })}
      </div>
    </aside>
  </section>
  )
}

export default Inequality;
