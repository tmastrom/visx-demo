import React from "react";
import ReactDOM from "react-dom";
import ParentSize from "@visx/responsive/lib/components/ParentSize";

// import TemperatureBarStack from "./TemperatureBarStack";
// import LineChart from "./LineChart";
import DoubleLineChart from "./DoubleLineChart";

ReactDOM.render(
  
    <ParentSize>
      {parent => (
        <DoubleLineChart
          width={ parent.width }
          height={ parent.height }
        />
      )}
    </ParentSize>
  ,
  document.getElementById("root")
);