import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

import "../doubleLineChart.css";

const DoubleLineChart = ({
  title,
  time,
  fileName,
  lineOne,
  lineTwo,
  lineOneName,
  lineTwoName,
  i,
}) => {
  const svgRef = useRef();
  const [groups, setGroups] = useState(null);
  const [years, setYears] = useState(null);

  useEffect(() => {
    d3.csv(`../data/${fileName}.csv`).then((data) => {

      // const h = window.innerHeight / 3;

      const years = data.map((d) => d[time]);
      const lineOneData = data.map((d) =>
        d[lineOne]
          .replace(/ /g, "")
          .substring(0, d[lineOne].replace(/ /g, "").length - 1)
      );
      const lineTwoData = data.map((d) =>
        d[lineTwo]
          .replace(/ /g, "")
          .substring(0, d[lineTwo].replace(/ /g, "").length - 1)
      );

      const max = [...lineOneData].sort((a, b) => b - a)[0];

      const g = [
        { group: lineOneData, color: "#d83933", name: lineOneName },
        { group: lineTwoData, color: "#15143a", name: lineTwoName },
      ];

      setGroups(g);
      setYears(years);

      const w = parseInt(d3.select(svgRef.current).style('width'), 10)
      const h = parseInt(d3.select(svgRef.current).style('height'), 10)

      const svg = d3
        .select(svgRef.current)
        .attr("width", w)
        .attr("height", h)
        .style("background", "transparent")
        .style("margin-bottom", "50")
        .style("overflow", "visible");

      const xScale = d3
        .scaleLinear()
        .domain([0, lineOneData.length - 1])
        .range([0, w]);

      const yScale = d3.scaleLinear().domain([0, max]).range([h, 0]);

      const generateScaledLine = d3
        .line()
        .x((d, i) => xScale(i))
        .y(yScale)
        .curve(d3.curveCardinal);

      // setting the axes
      const xAxis = d3
        .axisBottom(
          d3
            .scaleLinear()
            .domain([years[0], years[years.length - 1]])
            .range([0, w])
        )
        .ticks(10)
        .tickFormat((i) => i + 1);

        ;
        const yAxis = d3.axisLeft(yScale).ticks(10).tickFormat((x) => `${x}%`);

      svg.append("g").call(yAxis);
      svg.append("g").call(xAxis).attr("transform", `translate(0, ${h})`);

      g.forEach((group, i) => {
        svg
          .selectAll(".line")
          .data([group.group])
          .join("path")
          .attr("d", (d) => generateScaledLine(d))
          .attr("fill", "none")
          .attr("stroke", group.color)
          .attr("stroke-width", 2);
      });
    });
  }, []);

  if (groups && years) {
    return (
      <section className={`doubleLineChart ${i === 0 ? 'dark' : null}`}>
        <h3 className='double-title'>{title}</h3>
        <div className='double-checkboxes'>
          {groups.map((group) => {
            return (
              <div key={group} className='double-checkbox'>
                <div
                  className='circle'
                  style={{ backgroundColor: group.color }}
                />
                <label htmlFor='scales'>{group.name}</label>
              </div>
            );
          })}
        </div>
        <svg ref={svgRef} />
      </section>
    );
  }

  return null;
};

export default DoubleLineChart;
