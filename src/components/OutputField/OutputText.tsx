import * as React from "react";

export interface OutputTextProps { data: string;}

export default class OutputText extends React.Component<OutputTextProps, {}> {
    render() {
		console.log(this.props.data);
        return <div>
			this.props.data
        </div>
			;
    }
}