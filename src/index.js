import React from "react";
import ReactDOM from "react-dom";
import ParentSize from "@visx/responsive/lib/components/ParentSize";

import DoubleLineChart from "./DoubleLineChart";
import TemperatureBarStack from "./TemperatureBarStack";
import AreaChart from "./AreaChart";


ReactDOM.render(

  <AreaChart/>
  
    // <ParentSize>
    //   {parent => (
    //     <TemperatureBarStack
    //       width={ parent.width }
    //       height={ parent.height }
    //     />
    //   )}
    // </ParentSize>
  ,
  document.getElementById("root")
);