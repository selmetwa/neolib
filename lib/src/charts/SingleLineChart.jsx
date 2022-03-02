import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import '../singleLineChart.css';

const SingleLineChart = ({ title, fileName, yValue, time }) => {
  const svgRef = useRef();

  useEffect(() => {
    d3.csv(`./public/${fileName}.csv`).then(data => {
      const w = window.innerWidth / 3;
      const h = window.innerHeight / 2.5;

      const yData = data.map(d => Number(d[yValue]))
      const years = data.map(d => d[time].slice(0, 4))

      const svg = d3.select(svgRef.current)
        .attr('width', w)
        .attr('height', h)
        .style('background', '#f5f5f5')
        .style('border', '1px solid #ccc')
        .style('margin-bottom', '50px')
        .style('overflow', 'visible')

      const xScale = d3.scaleLinear()
        .domain([0, yData.length - 1])
        .range([0, w])

      const yScale = d3.scaleLinear()
        .domain([d3.min(yData), d3.max(yData)])
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
        .ticks(10)
        .tickFormat(i => i + 1)

      const yAxis = d3.axisLeft(yScale)
        .ticks(10)

      svg.append('g')
        .call(yAxis)
      svg.append('g')
        .call(xAxis)
        .attr('transform', `translate(0, ${h})`)

      svg.selectAll('.line')
        .data([yData])
        .join('path')
        .attr('d', d => generateScaledLine(d))
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr("stroke-width", 1)
    });
  }, [])

  return (
    <div className="singleLineChart">
      <h3>{title}</h3>
      <svg ref={svgRef} />
    </div>
  )
}

export default SingleLineChart;