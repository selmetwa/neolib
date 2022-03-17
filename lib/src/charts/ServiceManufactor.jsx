import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

import '../doubleLineChart.css';

const ServiceManufactor = () => {
  const svgRef = useRef();
  const [groups, setGroups] = useState(null);
  const [years, setYears] = useState(null);

  useEffect(() => {
    d3.csv(`../data/service.csv`).then((data1) => {
      d3.csv(`../data/manufactor.csv`).then((data2) => {
        const years = [...new Set(data1.map((d) => d["date"].slice(0, 4)))];
        const manufactor = data2.map(
          (d) =>
            Number(
              d["manufactor"]
                .replace(/ /g, "")
                .substring(0, d["manufactor"].replace(/ /g, "").length - 1)
            ) * 500
        );
        const service = data1.map(
          (d) =>
            Number(
              d["service"]
                .replace(/ /g, "")
                .substring(0, d["service"].replace(/ /g, "").length - 1)
            ) * 1
        );

        const g = [
          { group: service, color: "#d83933", name: "Service" },
          { group: manufactor, color: "#15143a", name: "Manufactoring" },
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

        const xScale = d3.scaleLinear().domain([0, 624]).range([0, w]);

        const yScale = d3.scaleLinear().domain([0, 15000]).range([h, 0]);

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
          .ticks(15)
          .tickFormat((i) => i + 1);

        const yAxis = d3.axisLeft(yScale).ticks(20);

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
    });
  }, []);

  if (groups && years) {
    return (
      <>
      <div className='doubleLineChart dark'>
        <h3 className="double-title">Service vs Manufactoring jobs</h3>
        <div className="double-checkboxes">
          {groups.map(group => {
            return (
              <div key={group} className="double-checkbox">
                <div className="circle" style={{ backgroundColor: group.color }} />
                <label htmlFor="scales">{group.name}</label>
              </div>
            )
          })}
        </div>
        <svg ref={svgRef} />
      <p style={{
        textAlign: 'left',
        fontSize: '12px',
        marginTop: '20px'
      }}>Source: Bureau of Economic Analysis</p>
      </div>
      </>
    );
  }

  return null;
};

export default ServiceManufactor;
