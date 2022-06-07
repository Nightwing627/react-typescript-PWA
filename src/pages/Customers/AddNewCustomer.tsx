import * as React from "react";
import { connect } from "react-redux";
import AppBar from "src/navigation/App.Bar";
import { FormComponent } from "src/components/FormComponent";
import { Typography, Button, Grid } from "@material-ui/core";
import "./customers.scss";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import moment from "moment";
import {
  options,
  vehicleInputs,
  streetInputs,
  distCust,
  leadDealer,
  addressDetails,
} from "./customerInputs";
import { Tabs } from "src/components/Tabs";
import { Stepper } from "../BuyOrders/Stepper";
import { withRouter } from "react-router-dom";
import { isDealer, IHistory } from "src/state/Utility";

export interface IAddNewCustomerProps {
  history: IHistory;
}

export class AddNewCustomerImpl extends React.PureComponent<
  IAddNewCustomerProps,
  {}
> {
  constructor(props: IAddNewCustomerProps) {
    super(props);
  }

  public renderForm = () => {
    return (
      <React.Fragment>
        <SubFormHeading>Lead Basic Details</SubFormHeading>
        <FormComponent
          onSubmit={(v: any) => {
            console.log(">> v", v);
          }}
          formModel="userForm"
          hasSubmit={false}
          options={options}
        />
        <SubFormHeading>Address Details</SubFormHeading>
        <FormComponent
          onSubmit={(v: any) => {
            console.log(">> v", v);
          }}
          formModel="userForm"
          hasSubmit={false}
          options={streetInputs}
        />
        <SubFormHeading>Vehicle Details</SubFormHeading>
        <FormComponent
          onSubmit={(v: any) => {
            console.log(">> v", v);
          }}
          formModel="userForm"
          hasSubmit={false}
          options={vehicleInputs}
        />
        <SubFormHeading style={{ textAlign: "center" }}>
          Documents Required for RTO
        </SubFormHeading>
        <div className="upload-details">
          <UploadContainer heading="Original R.C. Book" />
          <UploadContainer heading="Bank NOC In case of Hypothecation" />
          <UploadContainer heading="Valid Insurance Photocopy" />
          <UploadContainer heading="Permit" />
          <UploadContainer heading="Tax" />
          <UploadContainer heading="Passing" />
        </div>
        <FormComponent
          onSubmit={(v: any) => {
            console.log(">> v", v);
          }}
          formModel="userForm"
          hasSubmit={true}
          allFormOptions={[...vehicleInputs, ...options, ...streetInputs]}
          options={[]}
        />
      </React.Fragment>
    );
  };

  renderRelated = () => {
    const relatedData = [
      {
        opp: "Nano-Test",
        stage: "Closed Won",
        amount: "2500000",
        date: "3/9/2020",
      },
    ];
    return (
      <React.Fragment>
        <SubFormHeading
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Opportunities{" "}
          <div>
            <Button
              onClick={() => this.props.history.push("/lead/add-new-lead")}
              variant="contained"
              color="primary"
            >
              New
            </Button>
          </div>
        </SubFormHeading>
        <Grid container>
          {relatedData.map((x) => {
            return (
              <Grid item xs={12} md={6} sm={12} lg={6}>
                <div className="card-container">
                  <Grid container>
                    <Grid
                      item
                      className="padding-6"
                      xs={12}
                      lg={12}
                      sm={12}
                      md={12}
                    >
                      <span className="description-text">Opportunity Name</span>
                      {x.opp}
                    </Grid>
                    <Grid
                      item
                      className="padding-6"
                      xs={12}
                      lg={12}
                      sm={12}
                      md={12}
                    >
                      <span className="description-text">Stage</span>
                      {x.stage}
                    </Grid>
                    <Grid
                      item
                      className="padding-6"
                      xs={12}
                      lg={12}
                      sm={12}
                      md={12}
                    >
                      <span className="description-text">Amount</span>
                      {x.amount}
                    </Grid>
                    <Grid
                      item
                      className="padding-6"
                      xs={12}
                      lg={12}
                      sm={12}
                      md={12}
                    >
                      <span className="description-text">Close Date</span>
                      {moment(x.date).format("DD/MM/YYYY")}
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            );
          })}
        </Grid>
      </React.Fragment>
    );
  };

  public tabData = [
    {
      tabName: "Details",
      component: this.renderForm(),
      onTabSelect: (tabName: any) => this.setState({ activeTab: tabName }),
    },
    {
      tabName: "Related",
      component: this.renderRelated(),
      onTabSelect: (tabName: any) => this.setState({ activeTab: tabName }),
    },
  ];
  render() {
    return (
      <AppBar>
        <div className="card-container no-hover">
          <Typography variant="h5" color="inherit" noWrap={true}>
            Customer Details
          </Typography>
          {isDealer() ? (
            <div className="">
              <Tabs tabsData={this.tabData} />
            </div>
          ) : (
            <FormComponent
              onSubmit={(v: any) => {
                console.log(">> v", v);
              }}
              formModel="userForm"
              hasSubmit={true}
              options={distCust}
            />
          )}
        </div>
      </AppBar>
    );
  }
}
export function mapStateToProps() {
  return {};
}
export const AddNewCustomer = withRouter(
  connect<{}, {}, IAddNewCustomerProps>(mapStateToProps)(
    AddNewCustomerImpl
  ) as any
);

const SubFormHeading = (props: any) => (
  <div style={props.style} className="sub-form-heading">
    {props.children}
  </div>
);

const UploadContainer = (props: any) => {
  const [file, setFile] = React.useState({
    name: `File${props.valKey}`,
    file: { name: "" },
  });
  const spllited = file.file.name.split(".");
  const ext = spllited[spllited.length - 1];
  return (
    <div key={props.valKey} className="upload-container">
      <div className="upload-head">{props.heading}</div>
      <div className="upload-button">
        <label title="Click To Upload File" htmlFor="upload">
          Upload Photo
        </label>
        <input
          onChange={(e) => {
            const fileData = e.target.files[0];
            setFile({ name: file.name, file: fileData });
          }}
          type="file"
          className="hidden-input"
          id="upload"
        />
        <span className="filename">{`${
          file.file.name.length > 10
            ? `${file.file.name.substr(0, 10)}...${ext}`
            : ""
        }`}</span>{" "}
        <div>
          <VisibilityIcon />
          <DeleteIcon
            key={props.valKey}
            onClick={() => {
              setFile({ name: "", file: { name: "" } });
            }}
          />
        </div>
      </div>
    </div>
  );
};
