import React, { useEffect, useRef } from "react";

import doubleCharts from "./constants/doubleCharts";
import DoubleLineChart from "./charts/DoubleLineChart";
import ServiceManufactor from "./charts/ServiceManufactor";

import * as d3 from "d3";

import "./doubleCharts.css";

const DoubleChartsWrapper = () => (
  <section className="doubleCharts">
    {doubleCharts.map((obj, i) => {
      const {
        title,
        time,
        fileName,
        lineOne,
        lineTwo,
        lineOneName,
        lineTwoName,
      } = obj;
      return (
        <DoubleLineChart
          {...{
            title,
            i,
            time,
            fileName,
            lineOne,
            lineTwo,
            lineOneName,
            lineTwoName,
          }}
        />
      );
    })}
    <ServiceManufactor />
  </section>
);

export default DoubleChartsWrapper;
