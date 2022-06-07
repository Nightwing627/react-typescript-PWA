import { Button, Typography, Grid } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import * as React from "react";
import { connect } from "react-redux";
import { FormComponent } from "src/components/FormComponent";
import { Tabs } from "src/components/Tabs";
import AppBar from "src/navigation/App.Bar";
import "./leads.scss";
import {
  options,
  streetInputs,
  vehicleInputs,
  leadSource,
  leadDealer,
  addressDetails,
} from "../Customers/customerInputs";
import Image, { Shimmer } from "react-shimmer";
import { TableWithGrid } from "src/components/TableWithGrid";
import Checkbox from "@material-ui/core/Checkbox";
import { Edit } from "@material-ui/icons";
import Select from "react-select";
import { BaseModal } from "src/components/BaseModal";
import { Stepper } from "../BuyOrders/Stepper";

const detailsObj = [
  {
    sNumber: 1,
    subject: "Call",
    dueDate: "4/30/2020",
    rating: "Hot",
    priotiy: "Normal",
    status: "Open",
    callResult: "Spoke with Customer ",
    comments: "Customer Intrested",
  },
  {
    sNumber: 2,
    subject: "Call",
    dueDate: "4/30/2020",
    rating: "Hot",
    priotiy: "Normal",
    status: "Open",
    callResult: "Spoke with Customer ",
    comments: "Customer Intrested",
  },
  {
    sNumber: 3,
    subject: "Call",
    dueDate: "4/30/2020",
    rating: "Hot",
    priotiy: "Normal",
    status: "Open",
    callResult: "Spoke with Customer ",
    comments: "Customer Intrested",
  },
];

export interface IAddNewLeadProps {}

const closedColumns = [
  {
    name: "itemName",
    label: "Item Name",
  },
  {
    name: "unitCost",
    label: "Unit Cost",
  },
  {
    name: "qty",
    label: "Quantity",
  },
  {
    name: "amount",
    label: "Amount",
  },
];

const products = [
  {
    value: "open",
    label: "Open",
  },
];

export class AddNewLeadImpl extends React.PureComponent<
  IAddNewLeadProps,
  { openEditModal: boolean; activeTab: number }
> {
  constructor(props: IAddNewLeadProps) {
    super(props);
    this.state = { openEditModal: false, activeTab: 0 };
  }
  // Basic Details Form
  public renderForm = () => {
    return (
      <React.Fragment>
        <SubFormHeading>Lead Basic Details</SubFormHeading>
        <FormComponent
          onSubmit={(v: any) => {
            console.log(">> v", v);
          }}
          formModel="leadForm"
          hasSubmit={false}
          options={options}
        />
        <SubFormHeading>Lead Source and Rating Details</SubFormHeading>
        <FormComponent
          onSubmit={(v: any) => {
            console.log(">> v", v);
          }}
          formModel="leadForm"
          hasSubmit={false}
          options={leadSource}
        />
        <SubFormHeading>Address Details</SubFormHeading>
        <FormComponent
          onSubmit={(v: any) => {
            console.log(">> v", v);
          }}
          formModel="leadForm"
          hasSubmit={false}
          options={streetInputs}
        />
        <SubFormHeading>Vehicle Details</SubFormHeading>
        <FormComponent
          onSubmit={(v: any) => {
            console.log(">> v", v);
          }}
          formModel="leadForm"
          hasSubmit={true}
          options={vehicleInputs}
        />
      </React.Fragment>
    );
  };

  renderRelated = () => {
    return (
      <SubFormHeading>
        Opportunities{" "}
        <Button variant="contained" color="primary">
          New
        </Button>{" "}
      </SubFormHeading>
    );
  };

  // RTO Docs Form
  renderDocsForRTO = () => {
    return (
      <React.Fragment>
        <SubFormHeading style={{ textAlign: "center" }}>
          Documents Required for RTO
        </SubFormHeading>
        <UploadContainer heading="Original R.C. Book" />
        <UploadContainer heading="Bank NOC In case of Hypothecation" />
        <UploadContainer heading="Valid Insurance Photocopy" />
        <UploadContainer heading="Permit" />
        <UploadContainer heading="Tax" />
        <UploadContainer heading="Passing" />
        <SubFormHeading style={{ textAlign: "center" }}>
          Documents Required Loan
        </SubFormHeading>
        <UploadContainer heading="Aadhaar Card" />
        <UploadContainer heading="PAN Card" />{" "}
        <FormComponent
          onSubmit={(v: any) => {
            console.log(">> v", v);
          }}
          formModel="leadForm"
          hasSubmit={true}
          options={[]}
        />
      </React.Fragment>
    );
  };

  // Negotiation Form
  renderNegotitation = () => {
    return (
      <div className="negotitation-container">
        <div>
          <Button variant="contained" color="default">
            Generate Proposal
          </Button>
        </div>
        <div className="negotitation-content">
          <div className="heading">Green Globe Fuel Solutions</div>
          <div className="info-container">
            <div className="image-container">
              {" "}
              <Image
                src="https://cdn2.iconfinder.com/data/icons/random-outline-3/48/random_14-512.png"
                fallback={<Shimmer width={300} height={300} />}
              />
            </div>
            <div className="details">
              <div className="detail">
                <span className="description-text">Created On:</span>
                06/05/2020
              </div>
              <div className="detail">
                <span className="description-text">Expiration Date:</span>
                03/11/2020
              </div>
              <div className="detail">
                <span className="description-text">Contact Name:</span>
                Nothing
              </div>
            </div>
          </div>
        </div>{" "}
        <FormComponent
          onSubmit={(v: any) => {
            console.log(">> v", v);
          }}
          formModel="leadForm"
          hasSubmit={true}
          options={[]}
        />
      </div>
    );
  };

  // Closed
  renderClosedTab = () => {
    return (
      <div>
        <TableWithGrid
          title={"Products Sold"}
          data={[
            {
              itemName: "Item 1",
              unitCost: 100,
              qty: 2,
              amount: 200,
            },
            {
              itemName: "Item 1",
              unitCost: 100,
              qty: 2,
              amount: 200,
            },
            {
              itemName: "Item 1",
              unitCost: 100,
              qty: 2,
              amount: 200,
            },
            {
              itemName: "Item 1",
              unitCost: 100,
              qty: 2,
              amount: 200,
            },
          ]}
          columns={closedColumns}
          options={{ responsive: "scrollMaxHeight" }}
        />{" "}
        <FormComponent
          onSubmit={(v: any) => {
            console.log(">> v", v);
          }}
          formModel="leadForm"
          hasSubmit={true}
          options={[]}
        />
      </div>
    );
  };

  checkboxInputs = [
    "CNG TUNE UP",
    "KIT SERVICE",
    "KIT REFITTING",
    "CYLINDER REMOVE",
    "CYLINDER REFITTING",
    "GRECO ACE KIT FITTING",
    "GRECO PRO KIT FITTING",
  ];

  renderJobCard = () => {
    return (
      <div className="job-card-container">
        <div>
          <SubFormHeading>Complaint Checklist</SubFormHeading>
        </div>
        <div>
          <SubFormHeading>Job Card</SubFormHeading>
          <Grid container>
            {this.checkboxInputs.map((checkbox) => (
              <React.Fragment>
                <Grid
                  className="checkbox-container"
                  item
                  xs={6}
                  md={6}
                  lg={6}
                  sm={6}
                >
                  <div className="label-text">{checkbox}</div>
                  <Checkbox
                    defaultChecked
                    color="primary"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
          <div className="right-button">
            <Button color="default" variant="contained">
              Close Job Card
            </Button>
          </div>
        </div>
        <SubFormHeading>
          Request Customer Feedback{" "}
          <div className="right-button">
            <Button color="default" variant="contained">
              Request
            </Button>
          </div>
        </SubFormHeading>{" "}
        <FormComponent
          onSubmit={(v: any) => {
            console.log(">> v", v);
          }}
          formModel="leadForm"
          hasSubmit={true}
          options={[]}
        />
      </div>
    );
  };

  renderActivitySection = () => {
    return (
      <div className="job-card-container">
        <SubFormHeading>
          Upcoming Tasks
          <div className="right-button">
            <Button
              color="primary"
              variant="contained"
              onClick={() => this.setState({ openEditModal: true })}
            >
              New
            </Button>
          </div>
        </SubFormHeading>
        <Grid container>
          {detailsObj.map((dData) => {
            return (
              <Grid item xs={12} md={6} lg={6}>
                <div className="activity-card card-container">
                  <div className="details-text">
                    <span className="description-text">S. No</span>{" "}
                    {dData.sNumber}
                  </div>
                  <div className="details-text">
                    <span className="description-text">Subject</span>{" "}
                    {dData.subject}
                  </div>
                  <div className="details-text">
                    <span className="description-text">Due Date</span>
                    {dData.dueDate}
                  </div>
                  <div className="details-text">
                    <span className="description-text">Rating</span>{" "}
                    {dData.rating}
                  </div>
                  <div className="details-text">
                    <span className="description-text">Priority</span>
                    {dData.priotiy}
                  </div>
                  <div className="details-text">
                    <span className="description-text">Status</span>{" "}
                    {dData.status}
                  </div>
                  <div className="details-text">
                    <span className="description-text">Call Result</span>
                    {dData.callResult}
                  </div>
                  <div className="details-text">
                    <span className="description-text">Comments</span>
                    {dData.comments}
                  </div>
                  <div className="edit-button">
                    <Edit />
                  </div>
                </div>
              </Grid>
            );
          })}
        </Grid>
      </div>
    );
  };

  public renderFormForActivity = () => {
    return (
      <div className="lead-modal-form">
        <Grid container spacing={4}>
          <div className="product-selection">
            <Grid xs={12} md={6} sm={6}>
              <Select
                className="r-select"
                placeholder="Subject"
                options={products}
              />
            </Grid>
            <Grid xs={12} md={4} sm={4}>
              <Select
                className="r-select"
                placeholder="Subject"
                options={products}
              />{" "}
            </Grid>
          </div>
        </Grid>
        <Grid container spacing={4}>
          <div className="product-selection">
            <Grid xs={12} md={6} sm={6}>
              <Select
                className="r-select"
                placeholder="Rating"
                options={products}
              />
            </Grid>
            <Grid xs={12} md={4} sm={4}>
              <Select
                className="r-select"
                placeholder="Status"
                options={products}
              />{" "}
            </Grid>
          </div>
        </Grid>
        <Grid container spacing={4}>
          <div className="product-selection">
            <Grid xs={12} md={6} sm={6}>
              <Select
                className="r-select"
                placeholder="Call Result"
                options={products}
              />
            </Grid>
            <Grid xs={12} md={4} sm={4}>
              <Select className="r-select" options={products} />{" "}
            </Grid>
          </div>
        </Grid>
        <div className="button-container">
          <Button
            onClick={() => this.setState({ openEditModal: false })}
            variant="contained"
            color="default"
          >
            Cancel
          </Button>
          <Button variant="contained" color="primary">
            Submit
          </Button>
        </div>
      </div>
    );
  };

  renderModal = () => {
    return (
      <BaseModal
        className="leads-modal"
        contentClassName="leads-content"
        onClose={() => this.setState({ openEditModal: false })}
        open={this.state.openEditModal}
      >
        <Grid container spacing={1} className="">
          <Grid item className="modal-margin" xs={12} md={12}>
            Add New Task
          </Grid>
          {this.renderFormForActivity()}
        </Grid>
      </BaseModal>
    );
  };

  renderStepper = () => {
    return (
      <Stepper
        stepData={[
          {
            label: "Basic Details",
            component: this.renderForm(),
          },
          {
            label: "Documents Collected",
            component: this.renderDocsForRTO(),
          },
          {
            label: "Negotiation",
            component: this.renderNegotitation(),
          },
          {
            label: "Closed",
            component: this.renderClosedTab(),
          },
          {
            label: "Job Card",
            component: this.renderJobCard(),
          },
        ]}
      />
    );
  };

  public tabData = [
    {
      tabName: "Details",
      component: this.renderStepper(),
      onTabSelect: (tabName: any) => this.setState({ activeTab: tabName }),
    },
    {
      tabName: "Activity",
      component: this.renderActivitySection(),
      onTabSelect: (tabName: any) => this.setState({ activeTab: tabName }),
    },
  ];

  render() {
    return (
      <AppBar>
        <div className="card-container no-hover add-leads-page">
          {this.renderModal()}
          <Typography variant="h5" color="inherit" noWrap={true}>
            Add New Lead
          </Typography>
          <div className="">
            <Stepper
              stepData={[
                {
                  label: "Draft",
                  component: (
                    <div>
                      <SubFormHeading>Lead Basic Details</SubFormHeading>
                      <FormComponent
                        onSubmit={(v: any) => {
                          console.log(">> v", v);
                        }}
                        formModel="userForm"
                        hasSubmit={false}
                        options={leadDealer}
                      />
                      <SubFormHeading>Lead Basic Details</SubFormHeading>
                      <FormComponent
                        onSubmit={(v: any) => {
                          console.log(">> v", v);
                        }}
                        formModel="userForm"
                        hasSubmit={true}
                        options={addressDetails}
                      />
                    </div>
                  ),
                },
                {
                  label: "Documents Collection",
                  component: (
                    <div>
                      <SubFormHeading>
                        Regular Business Documentation
                      </SubFormHeading>
                      <SubFormHeading>Workshop Approval Process</SubFormHeading>
                      <FormComponent
                        onSubmit={(v: any) => {
                          console.log(">> v", v);
                        }}
                        formModel="userForm"
                        hasSubmit={true}
                        options={[]}
                      />
                    </div>
                  ),
                },
                {
                  label: "Approval",
                  component: <div>Approvals {`&`} Inventory Load</div>,
                },
              ]}
            />
            {/* <Tabs tabsData={this.tabData} /> */}
          </div>
        </div>
      </AppBar>
    );
  }
}
export function mapStateToProps() {
  return {};
}
export const AddNewLead = connect<{}, {}, IAddNewLeadProps>(mapStateToProps)(
  AddNewLeadImpl
);

const SubFormHeading = (props: any) => (
  <div style={props.style} className="sub-form-heading">
    {props.children}
  </div>
);

const UploadContainer = (props: any) => {
  return (
    <div className="upload-container">
      <div className="upload-head">{props.heading}</div>
      <div className="upload-button">
        <label title="Click To Upload File" htmlFor="upload">
          Upload Photo
        </label>
        <input type="file" className="hidden-input" id="upload" />
        <VisibilityIcon />
        <DeleteIcon />
      </div>
    </div>
  );
};
