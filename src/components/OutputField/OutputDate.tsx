import * as React from "react";

export interface OutputDateProps { data: string; }

export default class OutputDate extends React.Component<OutputDateProps, {}> {
    render() {
        let dateString: string = "";
        if (this.props.data) {
            const date = new Date(this.props.data);

            dateString = [
                date.getFullYear(),
                ('0' + (date.getMonth() + 1)).slice(-2),
                ('0' + date.getDate()).slice(-2)
            ].join('/');
        }

        return <div>{dateString}</div>;
    }
}