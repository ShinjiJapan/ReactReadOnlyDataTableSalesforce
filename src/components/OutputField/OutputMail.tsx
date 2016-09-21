import * as React from "react";

export interface OutputMailProps { data: string; }

export default class OutputMail extends React.Component<OutputMailProps, {}> {
    render() {
        const mail = this.props.data
			? <a href={"mailto:" + this.props.data}>{this.props.data}</a>
            : null;
        return <div>{ mail }</div>;
    }
}