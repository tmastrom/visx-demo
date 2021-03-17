import React from "react";
import ReactDOM from "react-dom";
import ParentSize from "@visx/responsive/lib/components/ParentSize";

import TemperatureBarStack from "./TemperatureBarStack";

ReactDOM.render(
  

  
    <ParentSize>
      {parent => (
        <TemperatureBarStack
          width={ parent.width }
          height={ parent.height }
        />
      )}
    </ParentSize>
  ,
  document.getElementById("root")
);