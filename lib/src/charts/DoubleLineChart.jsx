import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

import '../wealth.css';

const DoubleLineChart = ({ title, time, fileName, lineOne, lineTwo, lineOneName, lineTwoName }) => {
  const svgRef = useRef();
  const [groups, setGroups] = useState(null);
  const [years, setYears] = useState(null);
  
  useEffect(() => {
    d3.csv(`../public/${fileName}.csv`).then(data => {
      const w = window.innerWidth / 2;
      const h = window.innerHeight / 1.5;

      const years = data.map(d => d[time])
      const lineOneData = data.map(d => d[lineOne].replace(/ /g, '').substring(0, d[lineOne].replace(/ /g, '').length - 1))
      const lineTwoData = data.map(d => d[lineTwo].replace(/ /g, '').substring(0, d[lineTwo].replace(/ /g, '').length - 1));

      const max = [...lineOneData].sort((a,b) => b-a)[0];
      
      const g = [
        { group: lineOneData, color: 'red', name: lineOneName },
        { group: lineTwoData, color: 'blue', name: lineTwoName },
      ]

      setGroups(g)
      setYears(years);

      const svg = d3.select(svgRef.current)
        .attr('width', w)
        .attr('height', h)
        .style('background', '#f5f5f5')
        .style('margin-bottom', '50')
        .style('overflow', 'visible')

      const xScale = d3.scaleLinear()
        .domain([0, lineOneData.length - 1])
        .range([0, w])

      const yScale = d3.scaleLinear()
        .domain([0, max])
        .range([h, 0])

      const generateScaledLine = d3.line()
        .x((d, i) => xScale(i))
        .y(yScale)
        .curve(d3.curveCardinal)

      // setting the axes
      const xAxis = d3.axisBottom(
        d3.scaleLinear()
          .domain([years[0], years[years.length - 1]])
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

      g.forEach((group, i) => {
        svg.selectAll('.line')
          .data([group.group])
          .join('path')
          .attr('d', d => generateScaledLine(d))
          .attr('fill', 'none')
          .attr('stroke', group.color)
          .attr("stroke-width", 1.5)
      })
    });
  }, []);

  if (groups && years) {
    return (
      <section className="wrapper">
        <svg ref={svgRef} />
        <aside className="aside">
        <div className="aside-text">
          <h1>{title}</h1>
          <h3>From {years[0]} to {d3.max(years)}</h3>
        </div>
        <div className="checkboxes">
          {groups.map(group => {
            return (
              <div key={group} className="checkbox">
                <div className="circle" style={{ backgroundColor: group.color }} />
                <label htmlFor="scales">{group.name}</label>
              </div>
            )
          })}
        </div>
      </aside>
      </section>
    )
  }

  return null
}

export default DoubleLineChart;