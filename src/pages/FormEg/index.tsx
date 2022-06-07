import * as React from "react";
import { FormComponent } from "src/components/FormComponent";
import AppBar from "src/navigation/App.Bar";

export class FormEg extends React.Component {
  handleSubmit = (values, error) => {
    console.log(">> values", values);
  };

  render() {
    return (
      //   <AppBar>
      <FormComponent
        hasSubmit={true}
        formModel="egForm"
        onSubmit={this.handleSubmit}
        options={[
          {
            label: "City",
            model: ".city",
            type: "text",
            required: true,
          },
          {
            label: "State/Provinance",
            model: ".state",
            type: "text",
            required: true,
          },
          {
            label: "Zip/Postal Code",
            model: ".zip",
            type: "text",
            required: false
          },
          {
            label: "Country",
            model: ".country",
            type: "text",
            required: true,
          },
        ]}
      />
      //   </AppBar>
    );
  }
}
