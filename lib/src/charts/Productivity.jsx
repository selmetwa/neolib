import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

import "../wealth.css";

const Productivity = () => {
  const svgRef = useRef();
  const [groups, setGroups] = useState(null);

  useEffect(() => {
    d3.csv("../data/productivity.csv").then((data) => {
      const w = window.innerWidth / 2;
      const h = window.innerHeight / 1.5;

      const years = data.map((d) => d["year"]);
      const productivity = data.map((d) =>
        d["  productivity growth"]
          .replace(/ /g, "")
          .substring(0, d["  productivity growth"].replace(/ /g, "").length - 1)
      );
      const wages = data.map((d) =>
        d["  wage growth"]
          .replace(/ /g, "")
          .substring(0, d["  wage growth"].replace(/ /g, "").length - 1)
      );

      const g = [
        { group: productivity, color: "red", name: "Productivity" },
        { group: wages, color: "blue", name: "Wages" },
      ];

      setGroups(g);

      const svg = d3
        .select(svgRef.current)
        .attr("width", w)
        .attr("height", h)
        .style("background", "#ddd")
        .style("margin-bottom", "50")
        .style("overflow", "visible");

      const xScale = d3
        .scaleLinear()
        .domain([0, productivity.length - 1])
        .range([0, w]);

      const yScale = d3.scaleLinear().domain([0, 200]).range([h, 0]);

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
  }, []);

  if (groups) {
    return (
      <section className='wrapper'>
        <svg ref={svgRef} />
        <aside className='aside'>
          <div className='aside-text'>
            <h1>Productivity Growth</h1>
            <h3>From 1976 to 2021</h3>
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
        </aside>
      </section>
    );
  }

  return null;
};

export default Productivity;
