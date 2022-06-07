import { Button, Grid, Typography, TextField } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import { Edit } from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import * as React from "react";
import { connect } from "react-redux";
import { Control, Form } from "react-redux-form";
import Select from "react-select";
import Image, { Shimmer } from "react-shimmer";
import { BaseModal } from "src/components/BaseModal";
import { FormComponent } from "src/components/FormComponent";
import { TableWithGrid } from "src/components/TableWithGrid";
import AppBar from "src/navigation/App.Bar";
import { Stepper } from "../BuyOrders/Stepper";
import moment from "moment";
import {
  addressDetails,
  leadDealer,
  leadSource,
  options,
  streetInputs,
  vehicleInputs,
  gstDetails,
} from "../Customers/customerInputs";
import "./leads.scss";
import { isDealer } from "src/state/Utility";
import { Tabs } from "src/components/Tabs";
// import { GSelect } from "src/components/GSelect";
import { getToken } from "src/state/Utility";
import getData from "src/utils/getData";
import { changeValuesInStore } from "src/state/Utility";
import { modelReducer, actions } from "react-redux-form";
import {
  leadForm as leadFormInitObj,
  userForm as userFormInitObj,
} from "../../reducers/CombinedReducers";

var loggedInUserDetails;
var detailsObj = [
  // {
  //   sNumber: 1,
  //   subject: "Call",
  //   dueDate: "4/30/2020",
  //   rating: "Hot",
  //   priotiy: "Normal",
  //   status: "Open",
  //   callResult: "Spoke with Customer ",
  //   comments: "Customer Intrested",
  // },
  // {
  //   sNumber: 2,
  //   subject: "Call",
  //   dueDate: "4/30/2020",
  //   rating: "Hot",
  //   priotiy: "Normal",
  //   status: "Open",
  //   callResult: "Spoke with Customer ",
  //   comments: "Customer Intrested",
  // },
  // {
  //   sNumber: 3,
  //   subject: "Call",
  //   dueDate: "4/30/2020",
  //   rating: "Hot",
  //   priotiy: "Normal",
  //   status: "Open",
  //   callResult: "Spoke with Customer ",
  //   comments: "Customer Intrested",
  // },
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

let intervalId = null;

export class AddNewLeadImpl extends React.Component<
  IAddNewLeadProps,
  {
    openEditModal: boolean;
    activeTab: String;
    activeStep: number;
    dealerCheckboxes: any;
    allTasks: any;
    id: number;
    complainCheckList: any;
    dealerCheckboxesChanged: boolean;
    currentInsertEmail: string;
    currentInsertId: string;
    currentNewSfid: string;
  }
> {
  constructor(props: IAddNewLeadProps) {
    super(props);
    this.state = {
      openEditModal: false,
      activeTab: "Details",
      activeStep: 0,
      allTasks: [],
      id: 0,
      dealerCheckboxesChanged: false,
      currentInsertEmail: "",
      currentInsertId: "",
      currentNewSfid: "",
      complainCheckList: {
        "Low Average / Mileage": false,
        "Late Starting Problem": false,
        "Jerking / Missing / Low Pick": false,
        "Changeover - Switch / Pressure Gauge Indication Problem": false,
        "Vehicle Not Changing over to CNG": false,
        "Vehicle Not starting in Petrol": false,
        "Engine Shutdown in Idleing mode / Return to idle from high RPM": false,
        "Less/Slow Gas Filling in Tank": false,
        "Check Engine Light on Cluster": false,
        "Petrol Consumption even when car running on CNG": false,
        "Noise after/due to CNG Kit Fittment": false,
        "Gas Leakage / Sound / Smell": false,
        "Switch Not Working(No lights on switch)": false,
        "Buzzer Noise on Switch": false,
      },
      dealerCheckboxes: {
        "CNG TUNE UP": false,
        "KIT SERVICE": false,
        "KIT REMOVE": false,
        "KIT REFITTING": false,
        "CYLINDER REMOVE": false,
        "CYLINDER REFITTING": false,
        "GRECO ACE KIT FITTING": false,
        "GRECO PRO KIT FITTING": false,
        "DICKY FLOOR REPAIR": false,
        "WIRING REPAIR": false,
        "WIRING REMOVE & REFITTING": false,
        "REDUCER R/R": false,
        "REDUCER SERVICE": false,
        "CARBURETTOR SERVICE": false,
        "THROTTLE BODY CLEANING": false,
        "AIR FILTER R/R": false,
        "SPARK PLUG R/R": false,
        "INGNITION COILS R/R": false,
        "INGNITION COIL CODE R/R": false,
        "PICK UP COIL R/R": false,
        "CNG SEQ. KIT TUNE UP": false,
        "ECM R/R": false,
        "MAP SENSOR R/R": false,
        "MAF/MAP SENSOR CLEAN": false,
        "GRECO INJECTOR R/R": false,
        "PETROL INJECTOR R/R": false,
        "TEMPRESURE SENSOR R/R": false,
        "TIMING ADVANCE PROCESS R/R": false,
        "FILLER VALVE R/R": false,
        "FILLER VALVE REPAIR": false,
        "LOW PRESSURE HOSE R/R": false,
        "PRESSURE GAUGE R/R": false,
        "HIGH PRESSURE PIPE R/R": false,
        "CYLINDER VALVE R/R": false,
        "SWITCH R/R": false,
        "COOLANT REPLACE": false,
        "TAPPET SETTING": false,
        "OIL & OIL FILTER REPLACE": false,
        "HEIGHT PAD FITMENT": false,
        "O2 SENSOR R/R": false,
        "O2 SENSOR CLEAN": false,
        "ENGINE TUNE UP": false,
        "ENGINE COMPRESSION CHECK": false,
        "FUEL PUMP R/R": false,
        "FUEL FILTER R/R": false,
        "FUEL PUMP RELAY R/R": false,
        "ANNUAL MAINTAINANACE CONTRACT": false,
        "CNG LEAKAGE CHECK": false,
        "EMULATOR R/R": false,
        "MIXER R/R": false,
        "1ST STAGE REGULATOR R/R": false,
        "2ND STAGE REGULATOR R/R": false,
        "CYLINDER HYDROTESTING": false,
        "1ST STAGE REGULATOR ORING R/R": false,
        "INJECTOR NOZZLE R/R": false,
        "GENERAL LABOUR CHARGES": false,
        "CAR SCANNING": false,
        "GAS FILLTER R/R": false,
        "CYLINDER BRACKET R/R": false,
        "1ST FREE SERVICE": false,
        "2ND FREE SERVICE": false,
        "3RD FREE SERVICE": false,
        "TAPPET COVER PACKING REPLACE": false,
        "VACCUM HOSE PIPE R/R": false,
        "FUEL GAUGE CORRECTOR FITMENT": false,
        "RAIL BRACKET R/R": false,
        "ECM BRACKET R/R": false,
        "REDUCER BRACKET R/R": false,
        "BLOCK PISTON R/R": false,
      },
    };
  }

  async componentDidMount() {
    // this.props.dispatch(actions.reset('rxFormReducer.userForm'));
    // this.props.dispatch(actions.reset('rxFormReducer'));
    // this.props.dispatch(actions.setInitial('rxFormReducer'));
    // this.props.dispatch(actions.setInitial('rxFormReducer.userForm'));
    console.log("this.props: ", this.props);
    loggedInUserDetails = getToken().data;
    const {
      match: { params },
    } = this.props;
    if (params && params.id) {
      this.setState({ id: params.id });
      let leadData = await this.getleadDataById(
        loggedInUserDetails.token,
        params.id
      );
      this.handelStateForEdit(leadData["0"], loggedInUserDetails.record_type);
    } else {
      let formType;
      let editData;
      if (loggedInUserDetails.record_type == "0122w000000cwfSAAQ") {
        formType = "leadForm";
        editData = leadFormInitObj;
      } else if (loggedInUserDetails.record_type == "0122w000000cwfNAAQ") {
        formType = "userForm";
        editData = userFormInitObj;
      }
      changeValuesInStore(formType, editData);
    }
  }

  componentWillUnmount() {
    changeValuesInStore("leadForm", leadFormInitObj);
    changeValuesInStore("userForm", userFormInitObj);
  }

  async getAllTasks(data, sfid) {
    let taskData;
    try {
      taskData = await getData({
        query: `SELECT subject, Lead_Rating__c, Priority, Call_Results__c, WhoId, status, ActivityDate 
        FROM salesforce.task WHERE WhoId like '%${sfid}%' `,
        token: data.token,
      });
      console.log("taskData =>", taskData);
      this.setState({ allTasks: taskData.result });
    } catch (e) {
      console.log(e);
    }
  }

  async getleadDataById(token, id) {
    let leadsData;
    try {
      leadsData = await getData({
        query: `SELECT *
      FROM salesforce.Lead 
      WHERE id= '${id}'`,
        token: token,
      });
    } catch (e) {
      console.log(e);
    }
    console.log("leadsData =>", leadsData);
    this.getAllTasks(loggedInUserDetails, leadsData.result[0].sfid);
    return leadsData.result;
  }

  handelStateForEdit = (leadData, record_type) => {
    let formType;
    if (record_type == "0122w000000cwfSAAQ") {
      formType = "leadForm";
    } else if (record_type == "0122w000000cwfNAAQ") {
      formType = "userForm";
    }

    const editData = {
      email: leadData.email,
      firstName: leadData.firstname,
      lastName: leadData.lastname,
      middleName: leadData.middlename,
      company: leadData.company,
      whatsAppNumber: leadData.whatsapp_number__c,
      leadType: leadData.lead_type__c,
      leadSource: leadData.leadsource,
      leadStatus: leadData.status,
      subLeadSource: leadData.sub_lead_source__c,
      rating: leadData.rating,
      street: leadData.street,
      city: leadData.city,
      state: leadData.state,
      zip: leadData.postalcode,
      country: leadData.country,
      vehicleNumber: leadData.vehicle_no__c,
      fuelType: leadData.fuel_type__c,
      wheeles: leadData.x3_or_4_wheeler__c,
      vehicleMek: leadData.vehicle_make__c,
      vehicleModel: leadData.vehicle_model__c,
      usage: leadData.usage_of_vehicle__c,
      vehicleType: leadData.engine__c,
      dailyRunning: leadData.daily_running_kms__c,
      registration: leadData.registration_year__c,
      mfg: leadData.year_of_manufacturing__c,
      chassis: leadData.chassis_no__c,
      gstNumber: leadData.gst_number__c,
    };
    const dealerCheckboxesData = {
      "CNG TUNE UP": leadData.cng_tune_up__c === "f" ? false : true,
      "KIT SERVICE": leadData.kit_service__c === "f" ? false : true,
      "KIT REMOVE": leadData.cng_tune_up__c === "f" ? false : true,
      "KIT REFITTING": leadData.kit_refitting__c === "f" ? false : true,
      "CYLINDER REMOVE": leadData.cylinder_remove__c === "f" ? false : true,
      "CYLINDER REFITTING":
        leadData.cylinder_refitting__c === "f" ? false : true,
      "GRECO ACE KIT FITTING":
        leadData.greco_ace_kit_fitting__c === "f" ? false : true,
      "GRECO PRO KIT FITTING":
        leadData.greco_pro_kit_fitting__c === "f" ? false : true,
      "DICKY FLOOR REPAIR": leadData.cng_tune_up__c === "f" ? false : true,
      "WIRING REPAIR": leadData.cng_tune_up__c === "f" ? false : true,
      "WIRING REMOVE & REFITTING":
        leadData.cng_tune_up__c === "f" ? false : true,
      "REDUCER R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "REDUCER SERVICE": leadData.cng_tune_up__c === "f" ? false : true,
      "CARBURETTOR SERVICE": leadData.cng_tune_up__c === "f" ? false : true,
      "THROTTLE BODY CLEANING": leadData.cng_tune_up__c === "f" ? false : true,
      "AIR FILTER R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "SPARK PLUG R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "INGNITION COILS R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "INGNITION COIL CODE R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "PICK UP COIL R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "CNG SEQ. KIT TUNE UP": leadData.cng_tune_up__c === "f" ? false : true,
      "ECM R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "MAP SENSOR R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "MAF/MAP SENSOR CLEAN": leadData.cng_tune_up__c === "f" ? false : true,
      "GRECO INJECTOR R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "PETROL INJECTOR R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "TEMPRESURE SENSOR R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "TIMING ADVANCE PROCESS R/R":
        leadData.cng_tune_up__c === "f" ? false : true,
      "FILLER VALVE R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "FILLER VALVE REPAIR": leadData.cng_tune_up__c === "f" ? false : true,
      "LOW PRESSURE HOSE R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "PRESSURE GAUGE R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "HIGH PRESSURE PIPE R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "CYLINDER VALVE R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "SWITCH R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "COOLANT REPLACE": leadData.cng_tune_up__c === "f" ? false : true,
      "TAPPET SETTING": leadData.cng_tune_up__c === "f" ? false : true,
      "OIL & OIL FILTER REPLACE":
        leadData.cng_tune_up__c === "f" ? false : true,
      "HEIGHT PAD FITMENT": leadData.cng_tune_up__c === "f" ? false : true,
      "O2 SENSOR R/R	": leadData.cng_tune_up__c === "f" ? false : true,
      "O2 SENSOR CLEAN": leadData.cng_tune_up__c === "f" ? false : true,
      "ENGINE TUNE UP": leadData.cng_tune_up__c === "f" ? false : true,
      "ENGINE COMPRESSION CHECK":
        leadData.cng_tune_up__c === "f" ? false : true,
      "FUEL PUMP R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "FUEL FILTER R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "FUEL PUMP RELAY R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "ANNUAL MAINTAINANACE CONTRACT":
        leadData.cng_tune_up__c === "f" ? false : true,
      "CNG LEAKAGE CHECK": leadData.cng_tune_up__c === "f" ? false : true,
      "EMULATOR R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "MIXER R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "1ST STAGE REGULATOR R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "2ND STAGE REGULATOR R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "CYLINDER HYDROTESTING": leadData.cng_tune_up__c === "f" ? false : true,
      "1ST STAGE REGULATOR ORING R/R":
        leadData.cng_tune_up__c === "f" ? false : true,
      "INJECTOR NOZZLE R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "GENERAL LABOUR CHARGES": leadData.cng_tune_up__c === "f" ? false : true,
      "CAR SCANNING": leadData.cng_tune_up__c === "f" ? false : true,
      "GAS FILLTER R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "CYLINDER BRACKET R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "1ST FREE SERVICE": leadData.cng_tune_up__c === "f" ? false : true,
      "2ND FREE SERVICE": leadData.cng_tune_up__c === "f" ? false : true,
      "3RD FREE SERVICE": leadData.cng_tune_up__c === "f" ? false : true,
      "TAPPET COVER PACKING REPLACE":
        leadData.cng_tune_up__c === "f" ? false : true,
      "VACCUM HOSE PIPE R/R	": leadData.cng_tune_up__c === "f" ? false : true,
      "FUEL GAUGE CORRECTOR FITMENT":
        leadData.cng_tune_up__c === "f" ? false : true,
      "RAIL BRACKET R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "ECM BRACKET R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "REDUCER BRACKET R/R": leadData.cng_tune_up__c === "f" ? false : true,
      "BLOCK PISTON R/R": leadData.cng_tune_up__c === "f" ? false : true,
    };
    this.setState({ dealerCheckboxes: dealerCheckboxesData });
    changeValuesInStore(formType, editData);
  };

  insertInDistStep1 = async (userForm) => {
    const currentUser = getToken().data;
    const {
      firstName,
      middleName,
      lastName,
      email,
      company,
      whatsAppNumber,
      leadType,
      leadSource,
      leadStatus,
      subLeadSource,
      rating,
      street,
      city,
      state,
      zip,
      country,
    } = userForm;
    const query = `INSERT INTO salesforce.Lead (FirstName,MiddleName,LastName,Email,Company,Whatsapp_number__c,Lead_Type__c,LeadSource,Status,Sub_Lead_Source__c,Rating,Street,City,State,PostalCode,Country,RecordTypeId,Assigned_Distributor__c)
    VALUES ('${firstName ?? ""}','${middleName ?? ""}','${lastName ?? ""}','${
      email ?? ""
    }','${company ?? ""}',${whatsAppNumber ? whatsAppNumber : ""},'${
      leadType ?? ""
    }', '${leadSource ?? ""}','${leadStatus ?? ""}','${subLeadSource ?? ""}','${
      rating ?? ""
    }','${street ?? ""}','${city ?? ""}','${state ?? ""}','${zip ?? ""}','${
      country ?? ""
    }', '0122w000000chRpAAI', '${currentUser.sfid}')`;

    try {
      const result = await getData({
        query,
        token: currentUser.token,
      });
      console.log(result);
      if (
        typeof result === "object" &&
        result.name &&
        result.name === "SyntaxError"
      ) {
        throw result;
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  insertDealerStep1 = async (userForm) => {
    const currentUser = getToken().data;
    const {
      firstName,
      middleName,
      lastName,
      email,
      company,
      whatsAppNumber,
      leadType,
      leadSource,
      leadStatus,
      subLeadSource,
      rating,
      street,
      city,
      state,
      zip,
      country,
      vehicleNumber,
      fuelType,
      wheeles,
      vehicleMek,
      vehicleModel,
      usage,
      vehicleType,
      dailyRunning,
      registration,
      mfg,
      chassis,
      gstNumber,
    } = userForm;
    const query = `INSERT INTO salesforce.Lead (FirstName, MiddleName, LastName,Email, Company,Whatsapp_number__c,Lead_Type__c,LeadSource,Status,Sub_Lead_Source__c ,Rating,Street,City,State ,PostalCode,Country, Vehicle_no__c,Fuel_Type__c,X3_or_4_Wheeler__c,Vehicle_Make__c, Vehicle_Model__c,Usage_of_Vehicle__c,Engine__c, Daily_Running_Kms__c,Registration_Year__c,Year_of_Manufacturing__c,Chassis_No__c,GST_Number__c , RecordTypeId, Assigned_Dealer__c) 
    VALUES    
    ('${firstName ?? ""}','${middleName ?? ""}','${lastName ?? ""}','${
      email ?? ""
    }','${company ?? ""}',${whatsAppNumber ? whatsAppNumber : 0},'${
      leadType ?? ""
    }', '${leadSource ?? ""}','${leadStatus ?? ""}','${subLeadSource ?? ""}','${
      rating ?? ""
    }','${street ?? ""}','${city ?? ""}','${state ?? ""}','${zip ?? ""}','${
      country ?? ""
    }', '${vehicleNumber ?? ""}','${fuelType ?? ""}','${wheeles ?? ""}','${
      vehicleMek ?? ""
    }','${vehicleModel ?? ""}','${usage ?? ""}','${vehicleType ?? ""}',
       ${dailyRunning ? dailyRunning : 0},'${
      registration ? registration : "4/5/2019"
    }',${mfg ? mfg : 0},'${chassis ?? ""}','${
      gstNumber ?? ""
    }', '0122w000000chRpAAI', '${currentUser.sfid}') RETURNING id, email, sfid`;

    try {
      const result = await getData({
        query,
        token: currentUser.token,
      });
      console.log(result);
      if (
        typeof result === "object" &&
        result.name &&
        result.name === "SyntaxError"
      ) {
        throw result;
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  updateDistStep1 = async (userForm) => {
    const currentUser = getToken().data;
    const {
      firstName,
      middleName,
      lastName,
      email,
      company,
      whatsAppNumber,
      leadType,
      leadSource,
      leadStatus,
      subLeadSource,
      rating,
      street,
      city,
      state,
      zip,
      country,
    } = userForm;

    const query = `update  salesforce.Lead set FirstName = '${
      firstName ?? ""
    }',MiddleName = '${middleName ?? ""}',LastName = '${
      lastName ?? ""
    }', Email = '${email ?? ""}',Company = '${
      company ?? ""
    }',Whatsapp_number__c='${whatsAppNumber ?? 0}',Lead_Type__c = '${
      leadType ?? ""
    }', LeadSource = '${leadSource ?? ""}',Status = '${
      leadStatus ?? ""
    }',Sub_Lead_Source__c = '${subLeadSource ?? ""}',Rating = '${
      rating ?? ""
    }',   Street = '${street ?? ""}',City = '${city ?? ""}',State = '${
      state ?? ""
    }',PostalCode ='${zip ?? ""}',Country ='${country ?? ""}' where id='${
      this.state.id
    }'`;
    const updateLead = await getData({
      query,
      token: currentUser.token,
    });
    console.log("updateLead => ", updateLead);
    return updateLead.result;
  };

  getSfid = async (email) => {
    const currentUser = getToken().data;
    const query = `select id, email,sfid from salesforce.lead where email = '${email}' `;
    const result = await getData({
      query,
      token: currentUser.token,
    });
    console.log(result.result[0].sfid);
    if (result.result[0].sfid !== null) {
      this.setState({ currentNewSfid: result.result[0].sfid });
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  setIntervalSfid = (email) => {
    const that = this;
    intervalId = setInterval(async () => that.getSfid(email), 2500);
  };

  getSfidFromContact = async () => {
    const currentUser = getToken().data;
    const { currentInsertEmail } = this.state;
    const query = `select id, email, sfid from salesforce.contact where email ='${currentInsertEmail}'`;
    const result = await getData({
      query,
      token: currentUser.token,
    });
    console.log(result);
    if (
      result &&
      result.result &&
      result.result[0] &&
      result.result[0].sfid !== null
    ) {
      console.log(result.result);
      this.setState({ currentNewSfid: result.result[0].sfid });
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  setIntervalSfidFromContact = () => {
    const that = this;
    intervalId = setInterval(async () => that.getSfidFromContact(), 2500);
  };

  insertDealerStep = async (status) => {
    console.log("***************************************");
    const currentUser = getToken().data;
    const { currentNewSfid } = this.state;
    const statusQuery = `UPDATE salesforce.lead set Status = '${status}' WHERE  sfid='${currentNewSfid}'`;
    const resultStatusQuery = await getData({
      query: statusQuery,
      token: currentUser.token,
    });
    console.log(resultStatusQuery);
    if (status === "Closed") {
      this.setState({ currentNewSfid: null });
      this.setIntervalSfidFromContact();
    }
  };

  InsertNewTask = async (data, leadTaskForm, id) => {
    const {
      subject,
      priority,
      date,
      rating,
      status,
      callResult,
      comment,
    } = leadTaskForm;
    const SFID = await getData({
      query: `SELECT * FROM Salesforce.lead WHERE id = '${id}'`,
      token: data.token,
    });
    console.log("SFID => ", SFID);

    try {
      const inserTask = await getData({
        query: `insert into salesforce.task 
        (Subject, priority, Status, Call_Results__c, Lead_Rating__c, 
          ActivityDate, Description, IsReminderSet, whoid)values
        ('${subject}', '${priority}', '${status}', '${callResult}', '${rating}', 
        '${moment(date).format("MM/DD/YYYY")}', '${comment}', true, '${
          SFID.result[0].sfid
        }')
        RETURNING Id`,
        token: data.token,
      });

      console.log("inserTask => ", inserTask);
      this.getAllTasks(data, SFID.result[0].sfid);
      return inserTask.result;
    } catch (e) {
      console.log(e);
    }
  };
  handleInsertTaskSubmit = async () => {
    this.InsertNewTask(
      loggedInUserDetails,
      this.props.leadTaskForm,
      this.state.id
    );
    this.setState({ openEditModal: false });
    changeValuesInStore(`leadTaskForm`, {});
  };

  InsertLeadDistributor = async (data, userForm) => {
    const {
      firstName,
      middleName,
      lastName,
      email,
      company,
      whatsAppNumber,
      leadType,
      leadSource,
      leadStatus,
      subLeadSource,
      rating,
      street,
      city,
      state,
      zip,
      country,
    } = userForm;
    const name = `${firstName ?? ""} ${middleName ?? ""} ${lastName ?? ""}`;
    try {
      const insertLead = await getData({
        query: `INSERT INTO salesforce.Lead
        (name, FirstName,MiddleName,LastName,Email,Company,Whatsapp_number__c,
          Lead_Type__c,LeadSource,Status,Sub_Lead_Source__c,
          Rating,Street,City,State,PostalCode,Country,RecordTypeId,Assigned_Distributor__c)
         Values('${name ?? ""}','${firstName ?? ""}','${middleName ?? ""}','${
          lastName ?? ""
        }','${email ?? ""}','${company ?? ""}',${whatsAppNumber ?? 0},'${
          leadType ?? ""
        }',
         '${leadSource ?? ""}','${leadStatus ?? ""}','${
          subLeadSource ?? ""
        }','${rating ?? ""}','${street ?? ""}','${city ?? ""}','${
          state ?? ""
        }','${zip ?? ""}','${country ?? ""}','0122w000000chRuAAI','${
          data.sfid
        }')`,
        token: data.token,
      });
      console.log("insertLead => ", insertLead);
      return insertLead.result;
    } catch (e) {
      console.log(e);
    }
  };

  UpdateLeadDistributer = async (data, userForm) => {
    const {
      firstName,
      middleName,
      lastName,
      email,
      company,
      whatsAppNumber,
      leadType,
      leadSource,
      leadStatus,
      subLeadSource,
      rating,
      street,
      city,
      state,
      zip,
      country,
    } = userForm;
    const name = `${firstName ?? ""} ${middleName ?? ""} ${lastName ?? ""}`;
    try {
      const updateLead = await getData({
        query: `update  salesforce.Lead set name = '${
          name ?? ""
        }', FirstName = '${firstName ?? ""}',MiddleName = '${
          middleName ?? ""
        }',LastName = '${lastName ?? ""}',
        Email = '${email ?? ""}',Company = '${
          company ?? ""
        }',Whatsapp_number__c='${whatsAppNumber ?? 0}',Lead_Type__c = '${
          leadType ?? ""
        }',
        LeadSource = '${leadSource ?? ""}',Status = '${
          leadStatus ?? ""
        }',Sub_Lead_Source__c = '${subLeadSource ?? ""}',Rating = '${
          rating ?? ""
        }',  
        Street = '${street ?? ""}',City = '${city ?? ""}',State = '${
          state ?? ""
        }',PostalCode ='${zip ?? ""}',Country ='${country ?? ""}'
         where id='${this.state.id}'`,
        token: data.token,
      });
      console.log("updateLead => ", updateLead);
      return updateLead.result;
    } catch (e) {
      console.log(e);
    }
  };
  handleLeadDistributorSubmit = async () => {
    if (this.state.id) {
      this.handleLeadDistributorUpdate();
    } else {
      this.handleLeadDistributorInsert();
    }
  };
  handleLeadDistributorInsert = async () => {
    loggedInUserDetails = getToken().data;
    await this.InsertLeadDistributor(loggedInUserDetails, this.props.userForm);
    this.props.history.push("/leads");
  };
  handleLeadDistributorUpdate = async () => {
    loggedInUserDetails = getToken().data;
    await this.UpdateLeadDistributer(loggedInUserDetails, this.props.userForm);
    this.props.history.push("/leads");
  };

  InsertLeadDealer = async (data, leadForm) => {
    const {
      firstName,
      middleName,
      lastName,
      email,
      company,
      whatsAppNumber,
      leadType,
      leadSource,
      leadStatus,
      subLeadSource,
      rating,
      street,
      city,
      state,
      zip,
      country,
      vehicleNumber,
      fuelType,
      wheeles,
      vehicleMek,
      vehicleModel,
      usage,
      vehicleType,
      dailyRunning,
      registration,
      mfg,
      chassis,
      gstNumber,
    } = leadForm;
    const name = `${firstName ?? ""} ${middleName ?? ""} ${lastName ?? ""}`;
    const { dealerCheckboxes } = this.state;
    try {
      const insertLead = await getData({
        query: `INSERT INTO salesforce.Lead
        (name,FirstName,MiddleName,LastName,Email,Company,Whatsapp_number__c,
          Lead_Type__c,LeadSource,Status,Sub_Lead_Source__c,
          Rating,Street,City,State,PostalCode,Country,
          Vehicle_no__c,Fuel_Type__c,X3_or_4_Wheeler__c,Vehicle_Make__c, Vehicle_Model__c,
          Usage_of_Vehicle__c,Engine__c, Daily_Running_Kms__c,Registration_Year__c,Year_of_Manufacturing__c,Chassis_No__c,
          GST_Number__c,Assigned_Dealer__c,RecordTypeId,CNG_TUNE_UP__c,KIT_SERVICE__c,KIT_REFITTING__c,CYLINDER_REFITTING__c,CYLINDER_REMOVE__c,
          GRECO_ACE_KIT_FITTING__c,GRECO_PRO_KIT_FITTING__c)
         Values('${name ?? ""}','${firstName ?? ""}','${middleName ?? ""}','${
          lastName ?? ""
        }','${email ?? ""}','${company ?? ""}',${whatsAppNumber ?? 0},'${
          leadType ?? ""
        }',
         '${leadSource ?? ""}','${leadStatus ?? ""}','${
          subLeadSource ?? ""
        }','${rating ?? ""}','${street ?? ""}','${city ?? ""}','${
          state ?? ""
        }','${zip ?? ""}','${country ?? ""}',
         '${vehicleNumber ?? ""}','${fuelType ?? ""}','${wheeles ?? ""}','${
          vehicleMek ?? ""
        }','${vehicleModel ?? ""}','${usage ?? ""}','${vehicleType ?? ""}',
         ${dailyRunning ?? 0},'${registration ?? "4/5/2019"}',${mfg ?? 0},'${
          chassis ?? ""
        }','${gstNumber ?? ""}','${data.sfid}','0122w000000chRpAAI',
         ${dealerCheckboxes["CNG TUNE UP"]},${
          dealerCheckboxes["KIT SERVICE"]
        },${dealerCheckboxes["KIT REFITTING"]},
         ${dealerCheckboxes["CYLINDER REFITTING"]},
         ${dealerCheckboxes["CYLINDER REMOVE"]},${
          dealerCheckboxes["GRECO ACE KIT FITTING"]
        },${dealerCheckboxes["GRECO PRO KIT FITTING"]}) RETURNING Id`,
        token: data.token,
      });
      ``;
      console.log("insertLead => ", insertLead);
      this.setState({ id: insertLead.result[0].id });
      return insertLead.result;
    } catch (e) {
      console.log(e);
    }
  };

  UpdateLeadDealer = async (data, leadForm) => {
    const {
      firstName,
      middleName,
      lastName,
      email,
      company,
      whatsAppNumber,
      leadType,
      leadSource,
      leadStatus,
      subLeadSource,
      rating,
      street,
      city,
      state,
      zip,
      country,
      vehicleNumber,
      fuelType,
      wheeles,
      vehicleMek,
      vehicleModel,
      usage,
      vehicleType,
      dailyRunning,
      registration,
      mfg,
      chassis,
      gstNumber,
    } = leadForm;
    const name = `${firstName ?? ""} ${middleName ?? ""} ${lastName ?? ""}`;
    const { dealerCheckboxes } = this.state;
    try {
      const updateLead = await getData({
        query: `UPDATE salesforce.Lead set name = '${
          name ?? ""
        }', FirstName = '${firstName ?? ""}', MiddleName = '${
          middleName ?? ""
        }', LastName = '${lastName ?? ""}', Email = '${
          email ?? ""
        }', Company = '${company ?? ""}', Whatsapp_number__c = '${
          whatsAppNumber ?? 0
        }',
        Lead_Type__c = '${leadType ?? ""}', LeadSource = '${
          leadSource ?? ""
        }', Status = '${leadStatus ?? ""}',
        Sub_Lead_Source__c = '${subLeadSource ?? ""}', Rating = '${
          rating ?? ""
        }', Street = '${street ?? ""}',
        City = '${city ?? ""}' , State = '${state ?? ""}' , PostalCode = '${
          zip ?? ""
        }' , Country = '${country ?? ""}',
        Vehicle_no__c = '${vehicleNumber ?? ""}', Fuel_Type__c = '${
          fuelType ?? ""
        }',
        X3_or_4_Wheeler__c = '${wheeles ?? ""}', Vehicle_Make__c = '${
          vehicleMek ?? ""
        }',
        Usage_of_Vehicle__c = '${usage ?? ""}', Engine__c = '${
          vehicleType ?? ""
        }',
        Daily_Running_Kms__c = ${dailyRunning ?? 0}, Registration_Year__c = '${
          registration ?? "4/5/2019"
        }',
        Year_of_Manufacturing__c = ${mfg ?? 0}, Chassis_No__c = '${
          chassis ?? ""
        }',
        GST_Number__c = '${gstNumber ?? ""}', Assigned_Dealer__c = '${
          data.sfid
        }',
        RecordTypeId = '0122w000000chRpAAI', CNG_TUNE_UP__c = ${
          dealerCheckboxes["CNG TUNE UP"]
        },
        KIT_SERVICE__c = ${
          dealerCheckboxes["KIT SERVICE"]
        }, KIT_REFITTING__c = ${dealerCheckboxes["KIT REFITTING"]},
        CYLINDER_REFITTING__c = ${dealerCheckboxes["CYLINDER REFITTING"]},
        CYLINDER_REMOVE__c = ${dealerCheckboxes["CYLINDER REMOVE"]},
        GRECO_ACE_KIT_FITTING__c = ${dealerCheckboxes["GRECO ACE KIT FITTING"]},
        GRECO_PRO_KIT_FITTING__c = ${
          dealerCheckboxes["GRECO PRO KIT FITTING"]
        } where id='${this.state.id}'`,
        token: data.token,
      });
      ``;
      console.log("updateLead => ", updateLead);
      return updateLead.result;
    } catch (e) {
      console.log(e);
    }
  };

  handleLeadDealerSubmit = async () => {
    if (this.state.id) {
      this.handleLeadDealerUpdate();
    } else {
      this.handleLeadDealerInsert();
    }
  };

  handleLeadDealerInsert = async () => {
    loggedInUserDetails = getToken().data;
    if (this.state.id) {
      await this.UpdateLeadDealer(loggedInUserDetails, this.props.leadForm);
    } else {
      await this.InsertLeadDealer(loggedInUserDetails, this.props.leadForm);
    }
    // this.setState({ activeTab: "Activity" })
    this.props.history.push("/leads");
  };
  handleLeadDealerUpdate = async () => {
    loggedInUserDetails = getToken().data;
    await this.UpdateLeadDealer(loggedInUserDetails, this.props.leadForm);
    // this.setState({ activeTab: "Activity" })
    this.props.history.push("/leads");
  };
  handleToggle = (event, isInputChecked) => {
    let fieldName = event.target.name;
    let dealerCheckboxes = this.state.dealerCheckboxes;
    dealerCheckboxes[fieldName] = isInputChecked;
    const dealerCheckboxesChanged = !this.state.dealerCheckboxesChanged;
    this.setState({
      dealerCheckboxesChanged,
      dealerCheckboxes,
    });
    console.log(this.state.dealerCheckboxes);
  };
  // Basic Details Form
  public renderForm = () => {
    return (
      <div className="card-container job-card-container">
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
            onSubmit={async (v: any) => {
              try {
                const result = await this.insertDealerStep1(v);
                this.setIntervalSfid(v.email);
                this.setState({
                  currentInsertId: result.result[0].id,
                  currentInsertEmail: v.email,
                  activeStep: this.state.activeStep + 1,
                });
              } catch (error) {
                console.log(error);
              }
            }}
            formModel="leadForm"
            hasSubmit={true}
            allFormOptions={[
              ...options,
              ...vehicleInputs,
              ...streetInputs,
              ...leadSource,
            ]}
            options={vehicleInputs}
            submitTitle="Save"
            cancelTitle="Previous"
          />
        </React.Fragment>
      </div>
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
      <div className="card-container job-card-container">
        <React.Fragment>
          <SubFormHeading>Documents Required for RTO</SubFormHeading>
          <UploadContainer valKey={1} heading="Original R.C. Book" />
          <UploadContainer
            valKey={2}
            heading="Bank NOC In case of Hypothecation"
          />
          <UploadContainer valKey={3} heading="Valid Insurance Photocopy" />
          <UploadContainer valKey={4} heading="Permit" />
          <UploadContainer valKey={5} heading="Tax" />
          <UploadContainer valKey={6} heading="Passing" />
          <SubFormHeading>KYC Documents</SubFormHeading>
          <UploadContainer valKey={7} heading="Aadhaar Card" />
          <UploadContainer valKey={8} heading="PAN Card" />{" "}
          <FormComponent
            onSubmit={async (v: any) => {
              console.log(">> v", v);
              console.log(this.state);
              if (this.state.currentNewSfid) {
                await this.insertDealerStep("Document Collection");
                this.setState({
                  activeStep: this.state.activeStep + 1,
                });
              }
            }}
            formModel="leadForm"
            hasSubmit={true}
            options={[]}
            submitTitle="Next"
            cancelTitle="Previous"
          />
        </React.Fragment>
      </div>
    );
  };

  // Negotiation Form
  renderNegotitation = () => {
    return (
      <div className="negotitation-container">
        <div style={{ textAlign: "right" }}>
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
          onSubmit={async (v: any) => {
            if (this.state.currentNewSfid) {
              await this.insertDealerStep("Negotiation");
              this.setState({
                activeStep: this.state.activeStep + 1,
              });
              console.log(">> v", v);
            }
          }}
          submitTitle="Next"
          cancelTitle="Previous"
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
      <div style={{ width: "100%" }}>
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
          onSubmit={async (v: any) => {
            console.log(">> v", v);
            if (this.state.currentNewSfid) {
              await this.insertDealerStep("Closed");
              this.setState({
                activeStep: this.state.activeStep + 1,
              });
            }
          }}
          formModel="leadForm"
          hasSubmit={true}
          options={[]}
          submitTitle="Next"
          cancelTitle="Previous"
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

  insertDealerJobCard = async () => {
    const currentUser = getToken().data;
    const {
      dealerCheckboxes: jCC,
      complainCheckList: cC,
      currentInsertEmail,
      currentNewSfid,
    } = this.state;

    const query1 = `select sfid from salesforce.contact where email ='${currentInsertEmail}'`;
    const result1 = await getData({
      query: query1,
      token: currentUser.token,
    });

    console.log(result1);

    const query = `INSERT INTO salesforce.job_card__c (customer__c,Lead__c,AIR_FILTER_R_R__c,BLOCK_PISTON_R_R__c,CARBURETTOR_SERVICE__c,CAR_SCANNING__c,CNG_LEAKAGE_CHECK__c,CNG_SEQ_KIT_TUNE_UP__c,CNG_TUNE_UP__c,COOLANT_REPLACE__c,CYLINDER_BRACKET_R_R__c,CYLINDER_HYDROTESTING__c,CYLINDER_REFITTING__c,CYLINDER_REMOVE__c,CYLINDER_VALVE_R_R__c,DICKY_FLOOR_REPAIR__c,ECM_BRACKET_R_R__c,ECM_R_R__c,EMULATOR_R_R__c,ENGINE_COMPRESSION_CHECK__c,ENGINE_TUNE_UP__c,FILLER_VALVE_REPAIR__c,FILLER_VALVE_R_R__c,FUEL_FILTER_R_R__c,FUEL_GAUGE_CORRECTOR_FITMENT__c,FUEL_PUMP_RELAY_R_R__c	,FUEL_PUMP_R_R__c,GAS_FILLTER_R_R__c,GENERAL_LABOUR_CHARGES__c	,GRECO_ACE_KIT_FITTING__c,GRECO_INJECTOR_R_R__c	,GRECO_PRO_KIT_FITTING__c,HEIGHT_PAD_FITMENT__c,HIGH_PRESSURE_PIPE_R_R__c,INGNITION_COILS_R_R__c,INGNITION_COIL_CODE_R_R__c,INJECTOR_NOZZLE_R_R__c,KIT_REFITTING__c,KIT_REMOVE__c,KIT_SERVICE__c,LOW_PRESSURE_HOSE_R_R__c,MAF_MAP_SENSOR_CLEAN__c,MAP_SENSOR_R_R__c,MIXER_R_R__c,O2_SENSOR_CLEAN__c,O2_SENSOR_R_R__c,OIL_OIL_FILTER_REPLACE__c,PETROL_INJECTOR_R_R__c,PICK_UP_COIL_R_R__c,PRESSURE_GAUGE_R_R__c,RAIL_BRACKET_R_R__c,REDUCER_BRACKET_R_R__c,REDUCER_R_R__c,REDUCER_SERVICE__c,SPARK_PLUG_R_R__c,SWITCH_R_R__c,ANNUAL_MAINTAINANACE_CONTRACT__c,TAPPET_COVER_PACKING_REPLACE__c,TAPPET_SETTING__c,TEMPRESURE_SENSOR_R_R__c,THROTTLE_BODY_CLEANING__c,TIMING_ADVANCE_PROCESS_R_R__c,VACCUM_HOSE_PIPE_R_R__c,WIRING_REMOVE_REFITTING__c,WIRING_REPAIR__c,X1ST_FREE_SERVICE__c,X1ST_STAGE_REGULATOR_ORING_R_R__c,X1ST_STAGE_REGULATOR_R_R__c,X2ND_FREE_SERVICE__c,X2ND_STAGE_REGUALTOR_R_R__c,X3RD_FREE_SERVICE__c,Low_Average_Mileage__c,Late_Starting_Problem__c,Jerking_Missing_Low_Pick__c,Changeover__c,Vehicle_Not_Changing__c,Vehicle_Not_starting__c,Engine_Shutdown__c	,Less_Slow_Gas__c,Check_Engine__c,Petrol_Consumption__c,Noise_after__c,Gas_Leakage__c,Switch_Not_Working_No_lights_on_switch__c,Buzzer_Noise_on_Switch__c
      ) VALUES
      
       ('${currentNewSfid}','',${jCC["AIR FILTER R/R"]},${jCC["BLOCK PISTON R/R"]},${jCC["CARBURETTOR SERVICE"]},${jCC["CAR SCANNING"]},${jCC["CNG LEAKAGE CHECK"]},${jCC["CNG SEQ. KIT TUNE UP"]},${jCC["CNG TUNE UP"]},${jCC["COOLANT REPLACE"]},${jCC["CYLINDER BRACKET R/R"]},${jCC["CYLINDER HYDROTESTING"]},
      ${jCC["CYLINDER REFITTING"]},${jCC["CYLINDER REMOVE"]},${jCC["CYLINDER VALVE R/R"]},${jCC["DICKY FLOOR REPAIR"]},${jCC["ECM BRACKET R/R"]},${jCC["ECM R/R"]},${jCC["EMULATOR R/R"]},${jCC["ENGINE COMPRESSION CHECK"]},${jCC["ENGINE TUNE UP"]},${jCC["FILLER VALVE REPAIR"]},
      ${jCC["FILLER VALVE R/R"]},${jCC["FUEL FILTER R/R"]},${jCC["FUEL GAUGE CORRECTOR FITMENT"]},${jCC["FUEL PUMP RELAY R/R"]},${jCC["FUEL PUMP R/R"]},${jCC["GAS FILLTER R/R"]},${jCC["GENERAL LABOUR CHARGES"]},${jCC["GRECO ACE KIT FITTING"]},${jCC["GRECO INJECTOR R/R"]},${jCC["GRECO PRO KIT FITTING"]},
      ${jCC["HEIGHT PAD FITMENT"]},${jCC["HIGH PRESSURE PIPE R/R"]},${jCC["INGNITION COILS R/R"]},${jCC["INGNITION COIL CODE R/R"]},${jCC["INJECTOR NOZZLE R/R"]},${jCC["KIT REFITTING"]},${jCC["KIT REMOVE"]},${jCC["KIT SERVICE"]},${jCC["LOW PRESSURE HOSE R/R"]},${jCC["MAF/MAP SENSOR CLEAN"]},

      ${jCC["MAP SENSOR R/R"]},${jCC["MIXER R/R"]},${jCC["O2 SENSOR CLEAN"]},${jCC["O2 SENSOR R/R"]},${jCC["OIL & OIL FILTER REPLACE"]},${jCC["PETROL INJECTOR R/R"]},${jCC["PICK UP COIL R/R"]},${jCC["PRESSURE GAUGE R/R"]},${jCC["RAIL BRACKET R/R"]},${jCC["REDUCER BRACKET R/R"]},

      ${jCC["REDUCER R/R"]},${jCC["REDUCER SERVICE"]},${jCC["SPARK PLUG R/R"]},${jCC["SWITCH R/R"]},${jCC["ANNUAL MAINTAINANACE CONTRACT"]},${jCC["TAPPET COVER PACKING REPLACE"]},${jCC["TAPPET SETTING"]},${jCC["TEMPRESURE SENSOR R/R"]},${jCC["THROTTLE BODY CLEANING"]},${jCC["TIMING ADVANCE PROCESS R/R"]},

      ${jCC["VACCUM HOSE PIPE R/R"]},${jCC["WIRING REMOVE & REFITTING"]},${jCC["WIRING REPAIR"]},${jCC["1ST FREE SERVICE"]},${jCC["1ST STAGE REGULATOR ORING R/R"]},${jCC["1ST STAGE REGULATOR R/R"]},${jCC["2ND FREE SERVICE"]},${jCC["2ND STAGE REGULATOR R/R"]},${jCC["3RD FREE SERVICE"]},

      ${cC["Low Average / Mileage"]}, ${cC["Late Starting Problem"]}, ${cC["Jerking / Missing / Low Pick"]}, ${cC["Changeover - Switch / Pressure Gauge Indication Problem"]}, ${cC["Vehicle Not Changing over to CNG"]}, ${cC["Vehicle Not starting in Petrol"]}, ${cC["Engine Shutdown in Idleing mode / Return to idle from high RPM"]}, ${cC["Less/Slow Gas Filling in Tank"]}, ${cC["Check Engine Light on Cluster"]}, ${cC["Petrol Consumption even when car running on CNG"]}, ${cC["Noise after/due to CNG Kit Fittment"]}, ${cC["Gas Leakage / Sound / Smell"]}, ${cC["Switch Not Working(No lights on switch)"]}, ${cC["Buzzer Noise on Switch"]}

      )`;

    const resultStatusQuery = await getData({
      query,
      token: currentUser.token,
    });
    console.log(resultStatusQuery);
    this.props.history.push("/leads");
  };

  renderJobCard = () => {
    return (
      <div className="card-container job-card-container">
        <SubFormHeading>GST Details</SubFormHeading>
        <FormComponent
          onSubmit={(v: any) => {
            console.log(">> v", v);
            this.setState({
              activeStep: this.state.activeStep + 1,
            });
          }}
          formModel="leadForm"
          hasSubmit={false}
          options={gstDetails}
        />
        <div>
          <SubFormHeading>Complaint Checklist</SubFormHeading>
          <Grid container>
            {Object.keys(this.state.complainCheckList).map((key, value) => {
              // const isChecked = this.state.complainCheckList[key];
              return (
                <React.Fragment>
                  <Grid
                    className="checkbox-container"
                    item
                    xs={6}
                    md={6}
                    lg={6}
                    sm={6}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      {/* <div className="label-text">{key}</div> */}
                      <div>
                        <Checkbox
                          color="primary"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                          onChange={this.handleToggle}
                          key={key}
                          name={key}
                          // value={isChecked}
                          // {...this.state.id && { checked: isChecked }}
                        />
                        {key}
                      </div>
                    </div>
                  </Grid>
                </React.Fragment>
              );
            })}
          </Grid>
        </div>
        <div>
          <SubFormHeading>Job Card</SubFormHeading>
          <Grid container>
            {Object.keys(this.state.dealerCheckboxes).map((key, value) => {
              const isChecked = this.state.dealerCheckboxes[key];
              return (
                <React.Fragment>
                  <Grid
                    className="checkbox-container"
                    item
                    xs={6}
                    md={6}
                    lg={6}
                    sm={6}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      {/* <div className="label-text">{key}</div> */}
                      <div>
                        <Checkbox
                          color="primary"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                          onChange={this.handleToggle}
                          key={key}
                          name={key}
                          value={isChecked}
                          {...(this.state.id && { checked: isChecked })}
                        />
                        {key}
                      </div>
                    </div>
                  </Grid>
                </React.Fragment>
              );
            })}
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
            if (this.state.currentNewSfid) {
              this.insertDealerJobCard();
            }
            //this.handleLeadDealerSubmit();
          }}
          formModel="leadForm"
          hasSubmit={true}
          submitTitle="Save"
          options={[]}
          allFormOptions={gstDetails}
        />
      </div>
    );
  };

  renderActivitySection = () => {
    return (
      <div className="job-card-container job-card-container">
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
          {this.state.allTasks.map((dData) => {
            return (
              <Grid item xs={12} md={12} lg={12}>
                <div className="activity-card card-container">
                  <Grid item className="padding-6" md={6} xs={6} lg={6}>
                    <span className="description-text">S. No.:</span>
                    <span className="disp-details"> {dData.sNumber}</span>
                  </Grid>
                  <Grid item className="padding-6" md={6} xs={6} lg={6}>
                    <span className="description-text">Subject:</span>
                    <span className="disp-details"> {dData.subject}</span>
                  </Grid>

                  <Grid item className="padding-6" md={6} xs={6} lg={6}>
                    <span className="description-text">Due Date:</span>
                    <span className="disp-details"> {dData.activitydate}</span>
                  </Grid>
                  <Grid item className="padding-6" md={6} xs={6} lg={6}>
                    <span className="description-text">Rating:</span>
                    <span className="disp-details">
                      {" "}
                      {dData.lead_rating__c}
                    </span>
                  </Grid>

                  <Grid item className="padding-6" md={6} xs={6} lg={6}>
                    <span className="description-text">Priority:</span>
                    <span className="disp-details"> {dData.priority}</span>
                  </Grid>
                  <Grid item className="padding-6" md={6} xs={6} lg={6}>
                    <span className="description-text">Status:</span>
                    <span className="disp-details"> {dData.status}</span>
                  </Grid>

                  <Grid item className="padding-6" md={6} xs={6} lg={6}>
                    <span className="description-text">Call result:</span>
                    <span className="disp-details">
                      {" "}
                      {dData.call_results__c}
                    </span>
                  </Grid>
                  <Grid item className="padding-6" md={6} xs={6} lg={6}>
                    <span className="description-text">Comment:</span>
                    <span className="disp-details"> {dData.comments}</span>
                  </Grid>
                </div>
              </Grid>
            );
          })}
        </Grid>
      </div>
    );
  };

  public renderFormForActivity = () => {
    const handleChange = (value, key) => {
      changeValuesInStore(`leadTaskForm.${key}`, value);
    };

    return (
      <div className="lead-modal-form">
        <Grid container spacing={4}>
          <div className="product-selection">
            <Grid xs={12} md={5} sm={5}>
              <Select
                className="r-select"
                placeholder="Subject"
                onChange={(e) => handleChange(e.value, "subject")}
                options={[
                  { value: "Call", label: "Call" },
                  { value: "Send Letter", label: "Send Letter" },
                  { value: "SL", label: "SL" },
                  { value: "Send Quote", label: "Send Quote" },
                  { value: "Other", label: "Other" },
                ]}
              />
            </Grid>{" "}
            <span style={{ padding: "10px" }} />
            <Grid xs={12} md={5} sm={5}>
              <Select
                className="r-select"
                placeholder="Priority"
                onChange={(e) => handleChange(e.value, "priority")}
                options={[
                  { value: "High", label: "High" },
                  { value: "Normal", label: "Normal" },
                ]}
              />
            </Grid>{" "}
            <span style={{ padding: "10px" }} />
            <Grid xs={12} md={5} sm={5}>
              <input
                className="r-select"
                type="date"
                onChange={(e) => handleChange(e.target.value, "date")}
              />{" "}
            </Grid>
            <span style={{ padding: "10px" }} />
            <Grid xs={12} md={5} sm={5}>
              <Select
                className="r-select"
                placeholder="Rating"
                onChange={(e) => handleChange(e.value, "rating")}
                options={[
                  { value: "Hot", label: "Hot" },
                  { value: "Warm", label: "Warm" },
                  { value: "Cold", label: "Cold" },
                ]}
              />
            </Grid>{" "}
            <span style={{ padding: "10px" }} />
            <Grid xs={12} md={5} sm={5}>
              <Select
                className="r-select"
                placeholder="Status"
                onChange={(e) => handleChange(e.value, "status")}
                options={[
                  { value: "Open", label: "Open" },
                  { value: "Completed", label: "Completed" },
                ]}
              />{" "}
            </Grid>
            <span style={{ padding: "10px" }} />
            <Grid xs={12} md={5} sm={5}>
              <Select
                className="r-select"
                placeholder="Call Result"
                onChange={(e) => handleChange(e.value, "callResult")}
                options={[
                  { value: "Phone", label: "Phone" },
                  { value: "Space Unreachable", label: "Space Unreachable" },
                  {
                    value: "Customer didn't Pick",
                    label: "Customer didn't Pick",
                  },
                  {
                    value: "Spoke with Customer",
                    label: "Spoke with Customer",
                  },
                ]}
              />
            </Grid>{" "}
            <span style={{ padding: "10px" }} />
            <Grid xs={12} md={5} sm={5}>
              <TextField
                multiline
                rows={3}
                className="r-select textarea-full"
                placeholder="Comments"
                onChange={(e) => handleChange(e.target.value, "comment")}
                variant="outlined"
              />{" "}
            </Grid>
          </div>
        </Grid>
        <div className="button-container">
          {/* <Button
            onClick={() => this.setState({ openEditModal: false })}
            variant="contained"
            color="default"
          >
            Cancel
          </Button>
          <Button variant="contained" color="primary">
            Save
          </Button> */}
          <FormComponent
            onCancel={() => {
              this.setState({ openEditModal: false });
              changeValuesInStore(`editUserForm`, {});
            }}
            options={[]}
            submitTitle="SAVE"
            onSubmit={(v) => {
              this.handleInsertTaskSubmit();
            }}
            hasSubmit={true}
            formModel="leadTaskForm"
          />
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
        activeStep={this.state.activeStep}
        onChangeStep={(index) => this.setState({ activeStep: index })}
        stepData={[
          {
            label: "Basic Details",
            component: this.renderForm(),
          },
          {
            label: "Documents Collection",
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

  public tabData = () => [
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

  updateLeadDistStep = async (status) => {
    const currentUser = getToken().data;
    const { currentNewSfid } = this.state;
    const statusQuery = `UPDATE salesforce.lead set Status = '${status}' WHERE sfid like '${currentNewSfid}'`;
    const resultStatusQuery = await getData({
      query: statusQuery,
      token: currentUser.token,
    });
    console.log(resultStatusQuery);
  };

  render() {
    return (
      <AppBar>
        <div className="">
          {this.renderModal()}
          {/* <Typography variant="h5" color="inherit" noWrap={true}>
            {isDealer() ? "Lead Details - Customer" : "Lead - Dealer"}
          </Typography> */}
          <div className="">
            {!isDealer() ? (
              <Stepper
                activeStep={this.state.activeStep}
                onChangeStep={(index) => this.setState({ activeStep: index })}
                stepData={[
                  {
                    label: "Draft",
                    component: (
                      <div className="card-container job-card-container">
                        <SubFormHeading>Lead Basic Details</SubFormHeading>
                        <FormComponent
                          onSubmit={(v: any) => {
                            console.log(">> v", v.target.value);
                            this.setState({
                              activeStep: this.state.activeStep + 1,
                            });
                          }}
                          formModel="userForm"
                          hasSubmit={false}
                          submitTitle="Next"
                          options={leadDealer}
                        />
                        <SubFormHeading>Address Details</SubFormHeading>
                        <FormComponent
                          onSubmit={(v: any) => {
                            console.log(">> v", v);
                            console.log(">> this", this);
                            this.setState({
                              activeStep: this.state.activeStep + 1,
                            });
                          }}
                          formModel="userForm"
                          hasSubmit={false}
                          options={streetInputs}
                        />
                        <SubFormHeading>KYC Documents</SubFormHeading>
                        <UploadContainer valKey={7} heading="Aadhaar Card" />
                        <UploadContainer valKey={8} heading="PAN Card" />{" "}
                        <FormComponent
                          onSubmit={async (v: any) => {
                            console.log(">> v", v);
                            const { params } = this.props.match;
                            if (params && params.id) {
                              try {
                                const result = await this.updateDistStep1(
                                  v,
                                  params.id
                                );
                                this.setIntervalSfid(v.email);
                                this.setState({
                                  currentInsertEmail: v.email,
                                  activeStep: this.state.activeStep + 1,
                                });
                              } catch (error) {
                                console.log(error);
                              }
                            } else {
                              try {
                                const result = await this.insertInDistStep1(v);
                                this.setIntervalSfid(v.email);
                                this.setState({
                                  currentInsertEmail: v.email,
                                  activeStep: this.state.activeStep + 1,
                                });
                              } catch (error) {
                                console.log(error);
                              }
                            }
                          }}
                          formModel="userForm"
                          hasSubmit={true}
                          allFormOptions={[...streetInputs, ...leadDealer]}
                          options={[]}
                          submitTitle="Next"
                          cancelTitle="Previous"
                        />
                        {/* <button type = "submit"> submit </button> */}
                      </div>
                    ),
                  },
                  {
                    label: "Documents Collection",
                    component: (
                      <div className="card-container job-card-container">
                        <SubFormHeading>
                          Regular Business Documentation
                        </SubFormHeading>
                        <SubFormHeading>
                          Workshop Approval Process
                        </SubFormHeading>
                        <FormComponent
                          onSubmit={async (v: any) => {
                            if (this.state.currentNewSfid) {
                              await this.updateLeadDistStep(
                                "Document Collection"
                              );
                              this.setState({
                                activeStep: this.state.activeStep + 1,
                              });
                              console.log(">> v", v);
                            }
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
                    component: (
                      <div className="card-container job-card-container">
                        Approvals {`&`} Inventory Load
                        <div className="button-container">
                          <FormComponent
                            onSubmit={async (v: any) => {
                              if (this.state.currentNewSfid) {
                                await this.updateLeadDistStep("Approved");
                                this.props.history.push("/leads");
                                console.log(">> v", v);
                              }
                            }}
                            hasSubmit={true}
                            options={[]}
                            hasCancel={false}
                          />
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            ) : (
              <Tabs
                // isIndex={this.state.activeTab}
                tabsData={this.tabData()}
              />
            )}
          </div>
        </div>
      </AppBar>
    );
  }
}
export function mapStateToProps(state) {
  const { userForm, leadForm, leadTaskForm } = state.rxFormReducer;
  return { userForm, leadForm, leadTaskForm };
}
export function mapDispatchToProps(dispatch) {
  console.log("dispatch: ", dispatch);
  return { dispatch };
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
        }`}</span>
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
