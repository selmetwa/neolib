import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

import "../wealth.css";

const Inequality = () => {
  const [unit, setUnit] = useState("Adults");
  const [metric, setMetric] = useState(
    "Disposable Income Per Unit (nominal $)"
  );

  const [activeGroups, setGroups] = useState([
    "Top 0.01%",
    "Top 0.1%",
    "Top 1%",
    "Top 10%",
    "Middle 40%",
    "Bottom 50%",
  ]);
  const groups = [
    "Top 0.01%",
    "Top 0.1%",
    "Top 1%",
    "Top 10%",
    "Middle 40%",
    "Bottom 50%",
  ];

  const [colors] = useState({
    "Top 0.01%": "#e66f0e",
    "Top 1%": "#04c585",
    "Top 10%": "#e52207",
    "Bottom 50%": "#009ec1",
    "Middle 40%": "#d72d79 ",
    "Top 0.1%": "black",
  });

  const svgRef = useRef();

  const destroyPreviousChart = () => {
    var svg = d3.select(".inequality-chart");
    svg.selectAll("*").remove();
  };

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
    d3.csv("http://neolib-data-files.s3.amazonaws.com/inequality.csv").then((data) => {
      const all = data.map((d) => d[metric]);
      const total = data
        .filter((d) => d["Group"] === "Total" && d["Unit"] === unit)
        .map((d) => d[metric]);
      const topTenPercent = data
        .filter((d) => d["Group"] === "Top 10%" && d["Unit"] === unit)
        .map((d) => Number(d[metric]));
      const topOnePercent = data
        .filter((d) => d["Group"] === "Top 1%" && d["Unit"] === unit)
        .map((d) => Number(d[metric]));
      const top0PointOnePercent = data
        .filter((d) => d["Group"] === "Top 0.1%" && d["Unit"] === unit)
        .map((d) => Number(d[metric]));
      const topOneTenthOfOnePercent = data
        .filter((d) => d["Group"] === "Top 0.01%" && d["Unit"] === unit)
        .map((d) => Number(d[metric]));
      const middleFourtyPercent = data
        .filter((d) => d["Group"] === "Middle 40%" && d["Unit"] === unit)
        .map((d) => Number(d[metric]));
      const bottomFiftyPercent = data
        .filter((d) => d["Group"] === "Bottom 50%" && d["Unit"] === unit)
        .map((d) => Number(d[metric]));

      const groups = [
        { group: topOneTenthOfOnePercent, color: "blue", name: "Top 0.01%" },
        { group: topOnePercent, color: "red", name: "Top 1%" },
        { group: topTenPercent, color: "green", name: "Top 10%" },
        { group: bottomFiftyPercent, color: "orange", name: "Bottom 50%" },
        { group: middleFourtyPercent, color: "yellow", name: "Middle 40%" },
        { group: top0PointOnePercent, color: "black", name: "Top 0.1%" },
      ];

      const groupsToRender = groups.filter((g) =>
        activeGroups.includes(g.name)
      );
      const groupsToRenderData = groupsToRender.map((g) => [...g.group]).flat();

      const w = parseInt(d3.select(svgRef.current).style("width"), 10);
      const h = parseInt(d3.select(svgRef.current).style("height"), 10);

      const svg = d3
        .select(svgRef.current)
        .attr("width", w)
        .attr("height", h)
        .style("background", "transparent")
        .style("margin-bottom", "50")
        .style("overflow", "visible");

      const xScale = d3
        .scaleLinear()
        .domain([0, total.length - 1])
        .range([0, w]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(groupsToRenderData)])
        .range([h, 0]);

      const generateScaledLine = d3
        .line()
        .x((d, i) => xScale(i))
        .y(yScale)
        .curve(d3.curveCardinal);

      // setting the axes
      const xAxis = d3
        .axisBottom(d3.scaleLinear().domain([1976, 2021]).range([0, w]))
        .ticks(15)
        .tickFormat((i) => i + 1);

      const T = 1000000000000;
      const B = 1000000000;
      const M = 1000000;
      const K = 1000;

      function numFormatter(num) {
        if (num > 999 && num < M) {
          return (num / 1000).toFixed(0) + "K"; // convert to K for number from > 1000 < 1 million
        } else if (num >= M && num < B) {
          return (num / M).toFixed(0) + "M"; // convert to M for number from > 1 million
        } else if (num >= B && num < T) {
          return (num / B).toFixed(0) + "B";
        } else if (num >= T) {
          return (num / T).toFixed(0) + "T";
        } else if (num < 900) {
          return num; // if value < 1000, nothing to do
        }
      }

      const yAxis = d3
        .axisLeft(yScale)
        .ticks(20)
        .ticks(20)
        .tickFormat((x) => `$${numFormatter(x)}`);

      svg.append("g").call(yAxis);
      svg.append("g").call(xAxis).attr("transform", `translate(0, ${h})`);

      svg
        .append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -65)
        .attr("x", -100)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Average Real Disposable Income");

      groupsToRender.forEach((group, i) => {
        svg
          .selectAll(".line")
          .data([group.group])
          .join("path")
          .attr("d", (d) => generateScaledLine(d))
          .attr("fill", "none")
          .attr("stroke", colors[group.name])
          .attr("stroke-width", 2);
      });
    });
  }, [unit, metric, activeGroups]);

  return (
    <section className='wrapper'>
      <svg ref={svgRef} className='inequality-chart'></svg>
      <aside className='aside'>
        <div className='aside-text'>
          <h1>Real Disposable Income</h1>
        </div>
        <div className='checkboxes'>
          {groups.map((group) => {
            const isChecked = activeGroups.includes(group);
            return (
              <div key={group} className='checkbox'>
                <input
                  type='checkbox'
                  checked={isChecked}
                  className='box'
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
  );
};

export default Inequality;
