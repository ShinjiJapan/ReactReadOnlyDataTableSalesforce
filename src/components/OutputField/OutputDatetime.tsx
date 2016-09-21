import * as React from "react";

export interface OutputDatetimeProps { data: string; }

export default class OutputDatetime extends React.Component<OutputDatetimeProps, {}> {
    render() {
        let dateString: string = "";
        if (this.props.data) {
            const date = new Date(this.props.data);

            dateString = [
                date.getFullYear(),
                ('0' + (date.getMonth() + 1)).slice(-2),
                ('0' + date.getDate()).slice(-2)
            ].join('/')
                + (" " + ('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2))
        }
        return <div>{dateString}</div>;
    }
}