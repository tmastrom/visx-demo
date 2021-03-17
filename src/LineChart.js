import React from "react";
import { AreaClosed, BarStack } from "@visx/shape";
import { Group } from "@visx/group";
import { Grid } from "@visx/grid";
import { AxisBottom } from "@visx/axis";
import { curveMonotoneX } from '@visx/curve';
import appleStock, { AppleStock } from '@visx/mock-data/lib/mocks/appleStock';
import { max, extent, bisector } from 'd3-array';
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { timeFormat, timeParse } from "d3-time-format";
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip";
import { LegendOrdinal } from "@visx/legend";
import "./index.css";

const purple1 = "#6c5efb";
const purple2 = "#c998ff";
const purple3 = "#a44afe";
const background = "#eaedff";
const defaultMargin = { top: 40, right: 0, bottom: 0, left: 0 };
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: "rgba(0,0,0,0.9)",
  color: "white"
};


// Bar Chart
const data = [
  {
    date: "2020-10-01",
    London: "60",
    Paris: "68",
    Berlin: "61"
  },
  {
    date: "2020-10-02",
    London: "57",
    Paris: "58",
    Berlin: "62"
  },
  {
    date: "2020-10-03",
    London: "59",
    Paris: "57",
    Berlin: "72"
  },
  {
    date: "2020-10-04",
    London: "52",
    Paris: "59",
    Berlin: "68"
  },
  {
    date: "2020-10-05",
    London: "63",
    Paris: "57",
    Berlin: "63"
  },
  {
    date: "2020-10-06",
    London: "61",
    Paris: "62",
    Berlin: "61"
  },
  {
    date: "2020-10-07",
    London: "61",
    Paris: "64",
    Berlin: "61"
  },
  {
    date: "2020-10-08",
    London: "64",
    Paris: "66",
    Berlin: "60"
  },
  {
    date: "2020-10-09",
    London: "58",
    Paris: "62",
    Berlin: "60"
  },
  {
    date: "2020-10-10",
    London: "56",
    Paris: "59",
    Berlin: "55"
  },
  {
    date: "2020-10-11",
    London: "57",
    Paris: "58",
    Berlin: "52"
  },
  {
    date: "2020-10-12",
    London: "56",
    Paris: "58",
    Berlin: "54"
  },
  {
    date: "2020-10-13",
    London: "52",
    Paris: "56",
    Berlin: "55"
  },
  {
    date: "2020-10-14",
    London: "58",
    Paris: "57",
    Berlin: "51"
  }
];
const keys = ["London", "Paris", "Berlin"];

const temperatureTotals = data.reduce((allTotals, currentDate) => {
  const totalTemperature = keys.reduce((dailyTotal, k) => {
    dailyTotal += Number(currentDate[k]);
    return dailyTotal;
  }, 0);

  allTotals.push(totalTemperature);
  return allTotals;
}, []);

const parseDate = timeParse("%Y-%m-%d");
const format = timeFormat("%b %d");
const formatDate = (date) => format(parseDate(date));

const getDate = (d) => d.date;

const dateScale = scaleBand({ domain: data.map(getDate), padding: 0.2 });
const temparatureScale = scaleLinear({
  domain: [0, Math.max(...temperatureTotals)],
  nice: true
});
const colorScale = scaleOrdinal({
  domain: keys,
  range: [purple1, purple2, purple3]
});

let tooltipTimeout;

const getTemperature = (d) => {
    return data["2020-10-14"];
}

// data accessors
const getX = (d) => d.date;
const getY = (d) => d.value;


export default function LineChart({
  width,
  height,
  event = false,
  margin = defaultMargin
}) {
  const {
    tooltipOpen,
    tooltipTop,
    tooltipLeft,
    hideTooltip,
    showTooltip,
    tooltipData
  } = useTooltip();

  const { containerRef, TooltipInPortal } = useTooltipInPortal();

  if (width < 10) return null;

  const xMax = width;
  const yMax = height - margin.top - 100;

  dateScale.rangeRound([0, xMax]);
  temparatureScale.range([yMax, 0]);

  return width < 10 ? null : (
    <div style={{ position: "relative" }}>
      <svg ref={containerRef} width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={background}
          rx={14}
        />
        <Grid
          top={margin.top}
          left={margin.left}
          xScale={dateScale}
          yScale={temparatureScale}
          width={xMax}
          height={yMax}
          stroke="black"
          strokeOpacity={0.1}
          xOffset={dateScale.bandwidth() / 2}
        />
        <Group top={margin.top}>
            <AreaClosed
                data={data}
                x={getDate}
                y={d => getTemperature(getDate) ?? 0}
                yScale={temparatureScale}
                strokeWidth={1}
                stroke="url(#area-gradient)"
                fill="url(#area-gradient)"
                curve={curveMonotoneX}

            />
         
        </Group>
        <AxisBottom
          top={yMax + margin.top}
          scale={dateScale}
          tickFormat={formatDate}
          stroke={purple3}
          tickStroke={purple3}
          tickLabelProps={() => ({
            fill: purple3,
            fontSize: 11,
            textAnchor: "middle"
          })}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: margin.top / 2 - 10,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          fontSize: 14
        }}
      >
        <LegendOrdinal
          scale={colorScale}
          direction="row"
          labelMargin="0 15px 0 0"
        />
      </div>
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <div style={{ color: colorScale(tooltipData.key) }}>
            <strong>{tooltipData.key}</strong>
          </div>
          <div>{tooltipData.bar.data[tooltipData.key]}℉</div>
          <div>
            <small>{formatDate(getDate(tooltipData.bar.data))}</small>
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
}
