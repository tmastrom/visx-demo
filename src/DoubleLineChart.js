import React, { useState } from 'react';
import { extent, max } from 'd3-array';
import * as allCurves from '@visx/curve';
import { Group } from '@visx/group';
import { LinePath } from '@visx/shape';
import { scaleTime, scaleLinear } from '@visx/scale';
import { MarkerArrow, MarkerCross, MarkerX, MarkerCircle, MarkerLine } from '@visx/marker';
import generateDateValue, { DateValue } from '@visx/mock-data/lib/generators/genDateValue';

import { Grid } from "@visx/grid";
import { AxisBottom } from "@visx/axis";
import { timeFormat, timeParse } from "d3-time-format";
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip";
import { LegendOrdinal } from "@visx/legend";
import "./index.css";


const purple1 = "#6c5efb";
const purple2 = "#c998ff";
const purple3 = "#a44afe";
const background = "#eaedff";
const defaultMargin = { top: 40, right: 0, bottom: 100, left: 0 };
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: "rgba(0,0,0,0.9)",
  color: "white"
};


const lineCount = 1;
const series = new Array(lineCount).fill(null).map((_, i) =>
  // vary each series value deterministically
  generateDateValue(25, /* seed= */ 5 / 15).sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  ),
);
const allData = series.reduce((rec, d) => rec.concat(d), []);

// data accessors
const getX = (d) => d.date;
const getY = (d) => d.value;

// scales
const xScale = scaleTime({
    domain:  extent(allData, getX),
});

const yScale = scaleLinear({
    domain: [0, max(allData, getY)],
});

const parseDate = timeParse("%Y-%m-%d");
const format = timeFormat("%b %d");
const formatDate = (date) => format(parseDate(date));




export default function DoubleLineChart ({
    width, 
    height, 
    margin = defaultMargin
}) {
    const svgHeight =  height - 40;
    const lineHeight = svgHeight / lineCount;
    const xMax = width;
    const yMax = height - margin.top - 100;

    // update scale output ranges
    xScale.range([50, width - 100]);
    yScale.range([lineHeight - 300, 100]);

    return(
        <div style={{ position: "relative" }}>
            <svg width={width} height={height}>
                <rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill={background}
                rx={14}
                />
                <Group top={100}>
                    <LinePath
                        curve={ allCurves.curveNatural }
                        data={ allData }
                        x={ d => xScale(getX(d)) ?? 0 }
                        y={ d => yScale(getY(d)) ?? 0 }
                        stroke="#333"
                        strokeWidth={ 1 }
                        strokeOpacity={ 0.6 }
                    />
                </Group>
                <AxisBottom
                    top={yMax + margin.top}
                    scale={xScale}
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
        </div>
  );

}