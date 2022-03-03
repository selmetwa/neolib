import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

import "../wealth.css";

const ServiceManufactor = () => {
  const svgRef = useRef();
  const [groups, setGroups] = useState(null);
  const [years, setYears] = useState(null);

  useEffect(() => {
    d3.csv(`../public/service.csv`).then((data1) => {
      d3.csv(`../public/manufactor.csv`).then((data2) => {
        const w = window.innerWidth / 2;
        const h = window.innerHeight / 1.5;

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
          { group: service, color: "blue", name: "Service" },
          { group: manufactor, color: "red", name: "Manufactoring" },
        ];

        setGroups(g);
        setYears(years);

        const svg = d3
          .select(svgRef.current)
          .attr("width", w)
          .attr("height", h)
          .style("background", "#f5f5f5")
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
            .attr("stroke-width", 1.5);
        });
      });
    });
  }, []);

  if (groups && years) {
    return (
      <div>
        <svg ref={svgRef} />
        {/* <aside className='aside'>
          <div className='aside-text'>
            <h1>Service vs Manufactoring Jobs</h1>
            <h3>
              From {years[0]} to {d3.max(years)}
            </h3>
          </div>
          <div className='checkboxes'>
            {groups.map((group) => {
              return (
                <div key={group} className='checkbox'>
                  <div
                    className='circle'
                    style={{ backgroundColor: group.color }}
                  />
                  <label htmlFor='scales'>{group.name}</label>
                </div>
              );
            })}
          </div>
        </aside> */}
      </div>
    );
  }

  return null;
};

export default ServiceManufactor;
