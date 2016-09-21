import * as React from "react";
import Statics from "../Statics";
import QueryResult from "../models/QueryResult";
import Param from "../Params.ts";

import {getDescribeAndRecords} from "../connection/query";

declare function require(x: string): any;
const Griddle = require('griddle-react');


interface DataGridProps {

}

interface DataGridState {
	isBusy: boolean;
	records: any;
	columnMetaData: any;
}


export default class DataGrid extends React.Component<DataGridProps, DataGridState>{
	constructor() {
		super();

		this.state = {
			isBusy: true,
			records: null,
			columnMetaData: null,
		};
	}

	componentDidMount() {
		getDescribeAndRecords().then((result: any) => {
			this.setState({
				isBusy: false,
				records: result.records,
				columnMetaData: result.columnMetaData
			});
		}).catch(err => {
			console.log(JSON.stringify(err));
		});
	}

	render() {
		return <div>
			{this.state.isBusy
				? <div>Loading...</div>
				: <Griddle
					results={this.state.records || []}
					columnMetadata={this.state.columnMetaData}
					columns={Param.ListColumns}
					enableInfiniteScroll={Param.EnableInfiniteScroll}
					useFixedHeader={Param.UseFixedHeader}
					resultsPerPage={Param.ResultPerPage}
					bodyHeight={(Param.Height > 0) ? Param.Height : null}
					showFilter={Param.ShowFilter}
					/>}
		</div>;
	}
}
