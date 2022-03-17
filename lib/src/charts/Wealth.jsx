import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

import "../wealth.css";

const NewTest = () => {
  const [unit, setUnit] = useState("Adults");
  const [metric, setMetric] = useState("Total Wealth (nominal $)");
  const [activeGroups, setGroups] = useState([
    "Total",
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
    var svg = d3.select("svg");
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
    d3.csv("./dist/wealth.csv").then((data) => {
      const all = data.map((d) => d[metric]);
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
        // { group: total, color: "purple", name: "Total" },
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

      const w = parseInt(d3.select(svgRef.current).style('width'), 10);
      const h = parseInt(d3.select(svgRef.current).style('height'), 10);

      const svg = d3
        .select(svgRef.current)
        .attr("width", w)
        .attr("height", h)
        .style("background", "transparent")
        .style("overflow", "visible");

      const xScale = d3
        .scaleLinear()
        .domain([0, topTenPercent.length - 1])
        .range([0, w]);

      const yScale = d3
        .scaleLinear()
        .domain([d3.min(groupsToRenderData), d3.max(groupsToRenderData)])
        .range([h, 0]);

      const generateScaledLine = d3
        .line()
        .x((d, i) => xScale(i))
        .y(yScale)
        .curve(d3.curveCardinal);

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
        } else if (num > M && num < B) {
          return (num / M).toFixed(0) + "M"; // convert to M for number from > 1 million
        } else if (num > B && num < T) {
          return (num / B).toFixed(0) + "B";
        } else if (num > T) {
          return (num / T).toFixed(0) + "T";
        } else if (num < 900) {
          return num; // if value < 1000, nothing to do
        }
      }

      const formatTick = (x) => {
        if (metric === "Total Wealth (nominal $)") {
          return `$${numFormatter(x)}`
        }

        return `${(x * 100).toString().slice(0, 2)}%`;
      };

      const yAxis = d3
        .axisLeft(yScale)
        .ticks(20)
        .tickFormat((x) => formatTick(x));

      svg.append("g").call(yAxis);

      svg.append("g").call(xAxis).attr("transform", `translate(0, ${h})`);

      const generateYLabel = () => {
        if (metric === "Total Wealth (nominal $)") {
          return "Total Real Wealth";
        }

        return "Share of Total Wealth";
      };

      svg
        .append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -65)
        .attr("x", -100)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text(generateYLabel());

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
      <svg ref={svgRef} className="big-chart"></svg>
      <aside className='aside'>
        <div className='aside-text'>
          <h1>Wealth Growth by Class</h1>
        </div>
        <div className='selects'>
          <select onChange={handleUpdateUnit}>
            <option value={"Adults"}>Adults</option>
            <option value={"Households"}>Households</option>
          </select>
          <select onChange={handleUpdateShare}>
            <option value={"Total Wealth (nominal $)"}>
              Total Wealth (nominal $)
            </option>
            <option value={"Wealth Share"}>Share of Wealth (As a %)</option>
          </select>
        </div>

        <div className='checkboxes'>
          {groups.map((group) => {
            const isChecked = activeGroups.includes(group);
            return (
              <div key={group} className='checkbox'>
                <input
                  type='checkbox'
                  checked={isChecked}
                  value={group}
                  className="box"
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

export default NewTest;
