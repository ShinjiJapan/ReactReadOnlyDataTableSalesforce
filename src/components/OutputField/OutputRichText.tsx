import * as React from "react";

export interface OutputRichTextProps { data: string; }

export default class OutputRichText extends React.Component<OutputRichTextProps, {}> {
    render() {
        return <div dangerouslySetInnerHTML={{ __html: this.props.data }}></div>;
    }
}