import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Taxes = () => {
  const svgRef = useRef();

  useEffect(() => {
    d3.csv('./data/top_taxes.csv').then(data => {
      console.log('taxes: ', data)
      const w = window.innerWidth / 2;
      const h = window.innerHeight / 1.5;
      const rate = data.map(d => d['Rate'])
      const years = data.map(d=>d['Date'].slice(0,4))

      const svg = d3.select(svgRef.current)
      .attr('width', w)
      .attr('height', h)
      .style('background', '#ddd')
      .style('margin-top', '50')
      .style('margin-bottom', '50')
      .style('overflow', 'visible')

    const xScale = d3.scaleLinear()
      .domain([0, rate.length - 1])
      .range([0, w])

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([h, 0])

    const generateScaledLine = d3.line()
      .x((d, i) => xScale(i))
      .y(yScale)
      .curve(d3.curveCardinal)

    // setting the axes
    const xAxis = d3.axisBottom(
      d3.scaleLinear()
        .domain([years[0], years[years.length-1]])
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
      .data([rate])
      .join('path')
      .attr('d', d => generateScaledLine(d))
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr("stroke-width", 1.5)
  })
  }, [])

  return (
    <div>
      <h3>Top Marginal Tax Rate</h3>
      <svg ref={svgRef} />
    </div>
  )
}

export default Taxes;