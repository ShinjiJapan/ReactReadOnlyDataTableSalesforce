import * as React from "react";
import * as ReactDOM from "react-dom";
import Param from "./Params";

import DataGrid from "./components/DataGrid";

ReactDOM.render(
    <DataGrid />,
    document.getElementById(Param.ComponentId + "ReactTableContent")
);