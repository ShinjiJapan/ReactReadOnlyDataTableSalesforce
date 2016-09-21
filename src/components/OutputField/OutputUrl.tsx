import * as React from "react";

export interface OutputUrlProps { data: string; }

export default class OutputUrl extends React.Component<OutputUrlProps, {}> {
    render() {
        const url = this.props.data
            ? ~this.props.data.indexOf("://")
                ? this.props.data
                : "http://" + this.props.data
            : "";

        return <a href={url} target="_blank">
            {url}
        </a>;
    }
}