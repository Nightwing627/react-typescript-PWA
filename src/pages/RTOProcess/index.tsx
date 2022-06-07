import {
  Button,
  Fab,
  Grid,
  Typography,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { Add, Edit, PersonPin, Phone } from "@material-ui/icons";
import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { BaseModal } from "src/components/BaseModal";
import { isDealer, IHistory } from "src/state/Utility";
import { Tabs } from "src/components/Tabs";
import AppBar from "src/navigation/App.Bar";
import data from "../../data";
import "./rtoProcess.scss";
import { FormComponent } from "src/components/FormComponent";
import { getToken } from "src/state/Utility";
import getData from "src/utils/getData";
import {ChangePhoneFormat} from "src/components/Format";

var loggedInUserDetails;
var allCustomers;

export interface IRTOProcessProps {
  history: IHistory;
}

export class RTOProcessImpl extends React.PureComponent<
  IRTOProcessProps,
  {
    openEditModal: boolean;
    stage: string;
    customer: string;
    rtoDataMain: any;
    currentData: any;
    addNew: boolean;
  }
> {
  constructor(props: IRTOProcessProps) {
    super(props);
    this.state = {
      openEditModal: false,
      addNew: false,
      stage: "",
      customer: "",
      currentData: null,
      rtoDataMain: data.rto.data,
    };
  }
  
  async componentDidMount(){
    loggedInUserDetails = getToken().data;
    console.log("loggedInUserDetails: ", loggedInUserDetails);
    const rto = await this.getAllRTOProcesses(loggedInUserDetails);
    this.setState({ rtoDataMain: rto });
    const cust = await this.getAllCustomers(loggedInUserDetails);
    allCustomers = cust;
  }

  getAllRTOProcesses = async (data) => {
    console.log("data: ", data);
    let getRTOs;
    try{
      if(isDealer()){
        getRTOs = await getData({
          query: `SELECT *
          FROM  salesforce.RTO_and_Insurance_Process__c 
          WHERE Dealer__c like '%${data.sfid}%' `,
          token: data.token
        });
      }
      else{
        getRTOs = await getData({
          query: `SELECT *
          FROM  salesforce.RTO_and_Insurance_Process__c 
          WHERE Distributor__c like '%${data.sfid}%' `,
          token: data.token
       });
      }
      console.log("getRTOs => ", getRTOs);
      return getRTOs.result;
    }
    catch(e){
      console.log(e);
    }
  }

  getAllCustomers = async (data) => {
    try{
      let customerData;
      if(isDealer()){
        customerData = await getData({
          query: `SELECT sfid, name
          FROM salesforce.Contact 
          WHERE Assigned_Dealer__c LIKE '%${data.sfid}%' AND Recordtypeid = '0121s0000000WE4AAM'`,
          token: data.token
        })
      }
      else{
        customerData = await getData({
          query: `SELECT sfid, name
          FROM salesforce.Contact 
          WHERE contact.accountid LIKE '%${data.sfid}%' AND Recordtypeid = '0121s0000000WE4AAM'`,
          token: data.token
        })
    }
      console.log("customerData =>", customerData.result)
      return customerData.result;
    }
    catch(e){
      console.log(e);
    }
  }

  InsertRTOProcess = async (data, stage, customer) => {
    console.log("data: ", data);
    try{
      const insertRTO = await getData({
        query: `INSERT INTO salesforce.rto_and_insurance_process__c
        (Customer__c,Stage__c) Values('${customer}','${stage}') RETURNING Id`,
        token: data.token
      });
      console.log("insertRTO => ", insertRTO);
      return insertRTO.result;
    }
    catch(e){
      console.log(e);
    }
  }

  UpdateRTOStage = async (data, stage, sfid) => {
    console.log("data: ", data);
    try {
      const updatertostage = await getData({
        query: `UPDATE salesforce.RTO_and_Insurance_Process__c
        SET stage__c = '${stage}'
        WHERE sfid LIKE '%${sfid}%'`,
        token: data.token
      })

      console.log("updatertostage =>", updatertostage);
      // return updatertostage.result;
      
    } catch (e) {
        console.log('fetch Inventory Error', e)
    }
  }

  showEditPopup = (source) => {
    this.setState({
      openEditModal: true,
      currentData: source,
    });
  };

  handleStageSelect = (event) => {
    this.setState({
      stage: event.target.value,
    });
  };

  handleCustomerSelect = (event) => {
    this.setState({
      customer: event.target.value,
    });
  };

  handleStatusUpdate = async() => {
    this.UpdateRTOStage(loggedInUserDetails, this.state.stage, this.state.currentData.sfid);
    const res = await this.getAllRTOProcesses(loggedInUserDetails);
    this.setState({rtoDataMain: res});
    this.setState({openEditModal: false});
  };

  handleRTOInsert = async() => {
    console.log(this.state.customer)
    console.log(this.state.stage)
    this.InsertRTOProcess(loggedInUserDetails, this.state.stage, this.state.customer);
    const res = await this.getAllRTOProcesses(loggedInUserDetails);
    this.setState({rtoDataMain: res});
    this.setState({addNew: false});
  };

  renderEditModal = () => {
    return (
      <BaseModal
        className="support-modal"
        contentClassName="support-content"
        onClose={() => this.setState({ openEditModal: false })}
        open={this.state.openEditModal}
      >
        <Grid container className="modal-content">
          <Typography style={{ textAlign: "center", paddingBottom: "10px" }}>
            Change/Update Stage
          </Typography>
          <Grid item className="modal-margin" xs={12} md={12}>
            <FormControl variant="outlined" className="form-control">
              <InputLabel id="demo-simple-select-outlined-label">
                Select Stage
              </InputLabel>{" "}
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={this.state.stage}
                label="Select Stage"
                onChange={this.handleStageSelect}
                className="form-input"
              >
                <MenuItem value="Document Collected">Document Collected</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Submitted">Submitted</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <div className="button-container">
          <Button
            onClick={(e) => this.setState({ openEditModal: false })}
            variant="contained"
            color="default"
          >
            Cancel
          </Button>{" "}
          <Button 
            onClick={(this.handleStatusUpdate)}
            variant="contained" 
            color="primary"
          >
            Submit
          </Button>
        </div>
        {/* <div className="modal-buttons">
          <FormComponent
            hasSubmit={true}
            formModel="userForm"
            options={[]}
            onSubmit={this.handleStatusUpdate}
            onCancel={(e) => this.setState({ openEditModal: false })}
          />
        </div> */}
      </BaseModal>
    );
  };

  tabs = () => [
    {
      tabName: "Pending",
      component: (
        <Grid container={true}>
          <RTOList
            onClickEdit={this.showEditPopup}
            rtoDataMain={this.state.rtoDataMain && this.state.rtoDataMain.filter(
              (rto) => rto.stage__c !== "Closed"
            )}
          />
        </Grid>
      ),
    },
    {
      tabName: "Cleared",
      component: (
        <Grid container={true}>
          <RTOList
            onClickEdit={this.showEditPopup}
            rtoDataMain={this.state.rtoDataMain && this.state.rtoDataMain.filter(
              (rto) => rto.stage__c === "Closed"
            )}
          />
        </Grid>
      ),
    },
  ];

  renderAddNewRTODocModal = () => {
    return (
      <BaseModal
        className="support-modal"
        contentClassName="support-content"
        onClose={() => this.setState({ addNew: false })}
        open={this.state.addNew}
      >
        <div style={{ minWidth: "300px" }}>
          <Typography style={{ textAlign: "center", paddingBottom: "10px" }}>
            Add New Customer
          </Typography>
          <Grid item className="modal-margin" xs={12} md={12}>
            <FormControl variant="outlined" className="form-control">
              <InputLabel id="demo-simple-select-outlined-label">
                Search Customer
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                // value={this.state.stage}
                label="Select Customer"
                onChange={this.handleCustomerSelect}
                variant="outlined"
                className="form-input"
              >
                {allCustomers && allCustomers.map(cust => {
                  return(
                    <MenuItem value={cust.sfid}>{cust.name}</MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item className="modal-margin" xs={12} md={12}>
            <FormControl variant="outlined" className="form-control">
              <InputLabel id="demo-simple-select-outlined-label">
                Select Stage
              </InputLabel>{" "}
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                // value={this.state.stage}
                label="Select Stage"
                variant="outlined"
                onChange={this.handleStageSelect}
                className="form-input"
              >
                <MenuItem value="Document Collected">Document Collected</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Submitted">Submitted</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <div className="button-container">
            <Button
              onClick={(e) => this.setState({ addNew : false })}
              variant="contained"
              color="default"
            >
              Cancel
            </Button>{" "}
            <Button 
              onClick={this.handleRTOInsert}
              variant="contained" 
              color="primary"
            >
              Submit
            </Button>
          </div>
        </div>
      </BaseModal>
    );
  };

  render() {
    return (
      <AppBar>
        {this.renderAddNewRTODocModal()}
        {this.renderEditModal()}
        <Tabs tabsData={this.tabs()} />
        <span
          style={{ position: "absolute", right: 20, bottom: 20 }}
          onClick={() => this.setState({ addNew: true })}
        >
          <Fab color="secondary" aria-labelledby="add-ticket">
            <Add />
          </Fab>
        </span>
      </AppBar>
    );
  }
}
export function mapStateToProps() {
  return {};
}
export const RTOProcess = withRouter(
  connect<{}, {}, IRTOProcessProps>(mapStateToProps)(RTOProcessImpl) as any
);

const RTOList = (props: any) => {
  return props.rtoDataMain.map((rto: any, index: any) => {
    const rtoData = rto;
    return (
      <React.Fragment>
        <Grid key={index} item xs={12} md={6}>
          <div className="card-container ">
            <div className="rto-card-title">{rtoData.title}</div>
            <Grid key={index} container className="padding-6">
              <Grid item className="bold-font center" xs={6} md={6}>
                <PersonPin /> <span style={{ padding: "5px" }} />
                <div style={{marginTop: '-25px', marginLeft: '25px'}}>
                  {rtoData.contname__c}
                </div>
              </Grid>
              <Grid className="bold-fon center" item xs={6} md={6}>
                <Phone /> <span style={{ padding: "5px" }} />
                <div style={{marginTop: '-25px', marginLeft: '25px'}}>
                  {rtoData.mobile_no__c && ChangePhoneFormat(rtoData.mobile_no__c)}
                </div>
              </Grid>
            </Grid>
            <Grid container className="padding-6">
              <Grid item xs={6} md={6}>
                {rtoData.address__c}
              </Grid>
              <Grid item xs={6} md={6}>
                {rtoData.x3_or_4_wheeler__c}
              </Grid>
            </Grid>
            <Grid container className="padding-6">
              <Grid item xs={6} md={6}>
                {rtoData.vehicle_make__c}
              </Grid>
              <Grid item xs={6} md={6}>
                {rtoData.vehicle_model__c}
              </Grid>
            </Grid>
            <Grid container className="padding-6">
              <Grid item xs={6} md={6}>
                {rtoData.chassis_no__c}
              </Grid>
              {!isDealer() ?
                <Grid item xs={6} md={6}>
                  {rtoData.dealname__c}
                </Grid>
              :
                <Grid item xs={6} md={6}></Grid>
              }
            </Grid>
            <Grid className="rto-status" item xs={6} md={6}>
                {rtoData.stage__c || "Pending"}
            </Grid>
            {!rtoData.isCleared && (
              <div className="edit-button-container">
                <div
                  className="edit-button"
                  onClick={() => props.onClickEdit(rtoData)}
                >
                  <Edit />
                </div>
              </div>
            )}
            {rtoData.isCleared && (
              <div className="generate-doc">
                <span>Generate Docs</span>{" "}
              </div>
            )}
          </div>
        </Grid>
      </React.Fragment>
    );
  });
};
