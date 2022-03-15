import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import '../singleLineChart.css';

const SingleLineChart = ({ title, fileName, yValue, time, yLabel }) => {
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
        .style('background', 'transparent')
        // .style('border', '1px solid #ccc')
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

      // const formatTick = () => {
      //   if ()
      // }

      const T = 10000
      const B = 1000;

      function numFormatter(num) {
        if(num > B && num < T){
            return (num).toFixed(0).slice(0,2) + 'B'; // convert to K for number from > 1000 < 1 million 
        }else if(num > T){
            return (num).toFixed(0).slice(0,2) + 'T'; // convert to M for number from > 1 million 
        }
    }

      const sign = fileName === 'millitary' || fileName === 'debt' ? '$' : '';

      const formatTick = (x) => {
        if (fileName === 'debt') {
          return `${sign}${numFormatter(x)}${yLabel}`;
        }

        return `${sign}${x.toFixed(0)}${yLabel}`;
      }

      const yAxis = d3.axisLeft(yScale)
        .ticks(10)
        .tickFormat((x) => formatTick(x));

      svg.append('g')
        .call(yAxis)
      svg.append('g')
        .call(xAxis)
        .attr('transform', `translate(0, ${h})`)

      // svg.append("text")
      //   .attr("class", "y label")
      //   .attr("text-anchor", "end")
      //   .attr("y", -50)
      //   .attr("x", -100)
      //   .attr("dy", ".75em")
      //   .attr("transform", "rotate(-90)")
      //   .text(yLabel.toString());

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