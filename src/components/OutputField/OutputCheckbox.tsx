import * as React from "react";

export interface OutputCheckboxProps { data: string; }

export default class OutputCheckbox extends React.Component<OutputCheckboxProps, {}> {
    render() {
        return <div>
			<input type="checkbox"
				readOnly={true}
				checked={this.props.data === "true"}
				/>
        </div>
			;
    }
}