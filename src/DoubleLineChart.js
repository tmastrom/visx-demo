import React, { useState } from 'react';
import { extent, max } from 'd3-array';
import { Group } from '@visx/group';
import { curveMonotoneX, curveNatural } from '@visx/curve';
import { LinePath, AreaClosed } from '@visx/shape';
import { scaleTime, scaleLinear, scaleBand } from '@visx/scale';
import { MarkerArrow, MarkerCross, MarkerX, MarkerCircle, MarkerLine } from '@visx/marker';
import generateDateValue, { DateValue } from '@visx/mock-data/lib/generators/genDateValue';
import { LinearGradient } from '@visx/gradient';
import { Grid } from "@visx/grid";
import { AxisBottom } from "@visx/axis";
import { timeFormat, timeParse } from "d3-time-format";
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip";
import { LegendOrdinal } from "@visx/legend";
import "./index.css";

export const background = '#ffffff';
export const background2 = '#204051';
export const accentColor = '#edffea';
export const accentColorDark = '#75daad';

const purple3 = "#a44afe";
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
  generateDateValue(25, /* seed= */ i / 15).sort(
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

    const dateScale = scaleBand({ range: [defaultMargin.left, width],domain: allData.map(x => x.date)});

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
                <LinearGradient id="area-background-gradient" from={background} to={background2} />
                <Group top={100}>
                    <LinePath
                        curve={ curveNatural }
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
        </div>
  );

}