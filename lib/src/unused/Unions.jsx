import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Unions = () => {
  const svgRef = useRef();

  useEffect(() => {
    d3.csv('./data/unions.csv').then(data => {
      const w = window.innerWidth / 2;
      const h = window.innerHeight / 1.5;
      const unions = data.map(d => d['Value'])

      const svg = d3.select(svgRef.current)
        .attr('width', w)
        .attr('height', h)
        .style('background', '#ddd')
        .style('margin-top', '50')
        .style('margin-bottom', '50')
        .style('overflow', 'visible')

      const xScale = d3.scaleLinear()
        .domain([0, unions.length - 1])
        .range([0, w])

      const yScale = d3.scaleLinear()
        .domain([0, 35])
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

      svg.selectAll('.line')
        .data([unions])
        .join('path')
        .attr('d', d => generateScaledLine(d))
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr("stroke-width", 1.5)
    })
  }, [])

  return (
    <div>
      <h3>Union Membership</h3>
      <svg ref={svgRef} />
    </div>
  )
}

export default Unions