import * as React from "react";
import { connect } from "react-redux";
import AppBar from "src/navigation/App.Bar";
import { FormComponent } from "src/components/FormComponent";

export interface ICustomersProps {}

const options = [
  {
    placeholder: "Name",
    model: ".name",
    type: "text",
  },
  {
    placeholder: "Name",
    model: ".email",
    type: "select",
  },
];

export class CustomersImpl extends React.PureComponent<ICustomersProps, {}> {
  constructor(props: ICustomersProps) {
    super(props);
  }

  public render() {
    return (
      <AppBar>
        <FormComponent options={options} />
      </AppBar>
    );
  }
}
export function mapStateToProps() {
  return {};
}
export const Customers = connect<{}, {}, ICustomersProps>(mapStateToProps)(
  CustomersImpl
);
