import * as React from "react";

export interface OutputTextAreaProps { data: string; }

export default class OutputTextArea extends React.Component<OutputTextAreaProps, {}> {
    render() {

        return <div>{ (this.props.data || "").toString()
            .split(/\r\n|\r|\n/)
            .map((x, i) => { return <div key={ i.toString() }>{x}</div> }) }</div>;
    }
}