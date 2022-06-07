import { Button, Grid, Typography, Fab, TextField } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import { Edit, Add } from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import * as React from "react";
import { connect } from "react-redux";
import Select from "react-select";
import Image, { Shimmer } from "react-shimmer";
import { BaseModal } from "src/components/BaseModal";
import { FormComponent } from "src/components/FormComponent";
import { TableWithGrid } from "src/components/TableWithGrid";
import AppBar from "src/navigation/App.Bar";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Stepper } from "../BuyOrders/Stepper";
import { PersonPin, Phone } from "@material-ui/icons";
import { ChangePhoneFormat } from "src/components/Format";
import {
  addressDetails,
  leadDealer,
  leadSource,
  options,
  streetInputs,
  vehicleInputs,
  gstDetails,
} from "../Customers/customerInputs";
import "./jobCard.scss";
import { isDealer } from "src/state/Utility";
import { Tabs } from "src/components/Tabs";
import { GSelect } from "src/components/GSelect";
import data from "./../../data";
import { getToken, changeValuesInStore } from "src/state/Utility";
import getData from "src/utils/getData";
import { AnyCnameRecord } from "dns";
import { LabelList } from "recharts";


var loggedInUserDetails;

export interface IAddNewJobCardProps {}

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

export class AddNewJobCardImpl extends React.Component<
  IAddNewJobCardProps,
  {
    openEditModal: boolean;
    activeTab: number;
    activeStep: number;
    jobCardCheckboxesChanged: boolean;
    AllJobCards: any;
    OpenAddJobCard: boolean;
    jobCardCheckboxes: any;
    complaintCheckboxes: any;
    allCustAndLeads: any;
    selectedUser: any;
    basicDetailsFormRecordId : any;
  }
> {
  constructor(props: IAddNewJobCardProps) {
    super(props);
    this.state = {
      openEditModal: false,
      activeTab: 0,
      activeStep: 0,
      OpenAddJobCard: false,
      jobCardCheckboxesChanged: false,
      AllJobCards: [],
      jobCardCheckboxes: {
        "ANNUAL MAINTAINANACE CONTRACT": false,
        "AIR FILTER R/R": false,
        "BLOCK PISTON R/R": false,
        "CNG TUNE UP": false,
        "CYLINDER REMOVE": false,
        "CYLINDER REFITTING": false,
        "CARBURETTOR SERVICE": false,
        "CAR SCANNING": false,
        "CNG LEAKAGE CHECK": false,
        "CNG SEQ. KIT TUNE UP": false,
        "COOLANT REPLACE": false,
        "CYLINDER BRACKET R/R": false,
        "CYLINDER HYDROTESTING": false,
        "CYLINDER VALVE R/R": false,
        "DICKY FLOOR REPAIR": false,
        "ECM BRACKET R/R": false,
        "ECM R/R": false,
        "EMULATOR R/R": false,
        "ENGINE COMPRESSION CHECK": false,
        "ENGINE TUNE UP": false,
        "FILLER VALVE REPAIR": false,
        "FILLER VALVE R/R": false,
        "FUEL FILTER R/R": false,
        "FUEL GAUGE CORRECTOR FITMENT": false,
        "FUEL PUMP RELAY R/R": false,
        "FUEL PUMP R/R": false,
        "GRECO ACE KIT FITTING": false,
        "GRECO PRO KIT FITTING": false,
        "GAS FILLTER R/R": false,
        "GENERAL LABOUR CHARGES": false,
        "GRECO INJECTOR R/R": false,
        "HEIGHT PAD FITMENT": false,
        "HIGH PRESSURE PIPE R/R": false,
        "INGNITION COILS R/R": false,
        "INGNITION COIL CODE R/R": false,
        "INJECTOR NOZZLE R/R": false,
        "KIT REMOVE": false,
        "KIT SERVICE": false,
        "KIT REFITTING": false,
        "LOW PRESSURE HOSE R/R": false,
        "MAF/MAP SENSOR CLEAN": false,
        "MAP SENSOR R/R": false,
        "MIXER R/R": false,
        "O2 SENSOR CLEAN": false,
        "O2 SENSOR R/R": false,
        "OIL & OIL FILTER REPLACE": false,
        "PETROL INJECTOR R/R": false,
        "PICK UP COIL R/R": false,
        "PRESSURE GAUGE R/R": false,
        "RAIL BRACKET R/R": false,
        "REDUCER BRACKET R/R": false,
        "REDUCER R/R": false,
        "REDUCER SERVICE": false,
        "SPARK PLUG R/R": false,
        "SWITCH R/R": false,
        "TAPPET COVER PACKING REPLACE": false,
        "TAPPET SETTING": false,
        "TEMPRESURE SENSOR R/R": false,
        "THROTTLE BODY CLEANING": false,
        "TIMING ADVANCE PROCESS R/R": false,
        "VACCUM HOSE PIPE R/R": false,
        "WIRING REMOVE & REFITTING": false,
        "WIRING REPAIR": false,
        "1ST FREE SERVICE": false,
        "1ST STAGE REGULATOR ORING R/R": false,
        "1ST STAGE REGULATOR R/R": false,
        "2ND FREE SERVICE": false,
        "2ND STAGE REGUALTOR R/R": false,
        "3RD FREE SERVICE": false,
      },
      complaintCheckboxes: {
        "Low Average / Mileage": false,
        "Late Starting Problem": false,
        "Jerking / Missing / Low Pick": false,
        "Changeover - Switch / Pressure Gauge Ind": false,
        "Vehicle Not Changing over to CNG": false,
        "Vehicle Not starting in Petrol": false,
        "Engine Shutdown in Idleing mode / Return": false,
        "Less/Slow Gas Filling in Tank": false,
        "Check Engine Light on Cluster": false,
        "Petrol Consumption even when car running": false,
        "Noise after/due to CNG Kit Fittment": false,
        "Gas Leakage / Sound / Smell": false,
        "Switch Not Working(No lights on switch)": false,
        "Buzzer Noise on Switch": false,
      },
      selectedUser: null,
      allCustAndLeads: [],
      basicDetailsFormRecordId : "",
      isLeadOrCustomer : ""
    };
  }

  componentDidMount() {
    loggedInUserDetails = getToken().data;
    this.getCustAndLeads(loggedInUserDetails);
    this.getAllJobCards(loggedInUserDetails);
  }

  getAllJobCards = async (data) => {
    try{
      let jobCardData;
      if(data.record_type === '0122w000000cwfSAAQ'){
        jobCardData = await getData({
          query: `SELECT * FROM salesforce.job_card__c Full OUTER JOIN salesforce.contact 
          ON salesforce.job_card__c.customer__c = salesforce.contact.sfid 
          WHERE salesforce.contact.assigned_dealer__c  LIKE '%${data.sfid}%' `,
          token: data.token
        })
      }
      else if(data.record_type === "0122w000000cwfNAAQ"){
        jobCardData = await getData({
          query: `SELECT * FROM salesforce.job_card__c Full OUTER JOIN salesforce.contact 
          ON salesforce.job_card__c.customer__c = salesforce.contact.sfid 
          WHERE salesforce.contact.accountid  LIKE '%${data.sfid}%'`,
          token: data.token
        });
      }

      console.log("jobCardData =>", jobCardData.result)
      this.setState({ AllJobCards : jobCardData.result });

    }
    catch(e){
      console.log(e);
    }
  }

  getCustAndLeads = async (data) => {
    console.log("data: ", data);
    let custLeadsDataArr;
    try {
      if (isDealer()) {
        console.log("----------------Dealer---------------------------");
        const custData = await getData({
          query: `SELECT * FROM salesforce.Contact 
          WHERE Assigned_Dealer__c LIKE '%${data.sfid}%' AND RecordtypeId ='0121s0000000WE4AAM' AND Name is not null`,
          token: data.token,
        });
        custLeadsDataArr = custData.result.map((x) => {
          x.type = "customer";
          return x;
        });

        const leadsData = await getData({
          query: `SELECT * from salesforce.Lead 
          WHERE Assigned_Dealer__c LIKE '%${data.sfid}%' AND RecordTypeId = '0122w000000chRpAAI' 
          AND Name is not null AND Status != 'Closed'`,
          token: data.token
        });
        leadsData.result.map((l) => {
          l.type = "lead";
          return custLeadsDataArr.push(l);
        });
      } else {
        console.log("----------------Distributor---------------------------");
        const custData = await getData({
          query: `SELECT * FROM salesforce.Contact 
          WHERE contact.accountid LIKE '%${data.sfid}%' and RecordtypeId ='0121s0000000WE4AAM'  AND Name is not null`,
          token: data.token,
        });
        custLeadsDataArr = custData.result.map((x) => {
          x.type = "customer";
          return x;
        });

        const leadsData = await getData({
          query: `SELECT * FROM salesforce.Lead 
          WHERE Assigned_Distributor__c LIKE '%${data.sfid}%' AND RecordTypeId = '0122w000000chRpAAI' 
          AND Name is not null AND Status != 'Closed'`,
          token: data.token
        });
      }
      console.log("custLeadsDataArr: ", custLeadsDataArr);
      this.setState({ allCustAndLeads: custLeadsDataArr });
    } catch (e) {
      console.log(e);
    }
  };

  InsertJobCardDealer = async (data, leadForm) => {
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
    try {
      const insertJobCard = await getData({
        query: `INSERT INTO salesforce.Contact
        (name, FirstName, MiddleName, LastName, Company__c,Email,Whatsapp_number__c,
          Lead_Type__c,Lead_Source__c,Lead_Status__c,Sub_Lead_Source__c,Lead_Rating__c,
          MailingStreet,  MailingCity ,MailingState ,MailingCountry,MailingPostalCode,
          Vehicle_no__c,Fuel_Type__c,X3_or_4_Wheeler__c,Vehicle_Make__c, Vehicle_Model__c,
          Usage_of_Vehicle__c,Engine_Type__c, Daily_Running_Kms__c,Registration_Year__c,Year_of_Manufacturing__c,Chassis_No__c,
          GST_Number__c,Accountid,RecordTypeId)
         Values('${name ?? ""}','${firstName ?? ""}','${middleName ?? ""}','${
          lastName ?? ""
        }','${company ?? ""}','${email ?? ""}','${whatsAppNumber ?? 0}','${
          leadType ?? ""
        }',
         '${leadSource ?? ""}','${leadStatus ?? ""}','${
          subLeadSource ?? ""
        }','${rating ?? ""}','${street ?? ""}','${city ?? ""}','${
          state ?? ""
        }','${country ?? ""}','${zip ?? ""}',
         '${vehicleNumber ?? ""}','${fuelType ?? ""}','${wheeles ?? ""}','${
          vehicleMek ?? ""
        }','${vehicleModel ?? ""}','${usage ?? ""}','${vehicleType ?? ""}',
         ${dailyRunning ?? 0},'${registration ?? "2020-07-07"}',${
          mfg ?? 2010
        },'${chassis ?? ""}','${gstNumber ?? ""}','${
          data.sfid
        }','0121s0000000WE4AAM') RETURNING Id, sfid`,
        token: data.token,
      });
      ``;
      console.log("insertJobCard => ", insertJobCard);
      return insertJobCard.result;

    } catch (e) {
      console.log(e);
    }
  };

  getCustomerConditionalClause = (data) => {
    const { selectedUser } = this.state;
    if (isDealer()) {
      return `Assigned_Dealer__c='${data.sfid}', accountid = (select Assigned_distributor__c from salesforce.account where sfid like '%'${data.sfid}'%')  where sfid like '%${selectedUser.sfid}%'`;
    } else {
      return `Accountid = '${data.sfid}' where sfid='%${
        selectedUser && selectedUser.sfid
      }%'`;
    }
  };
  updateCustomer = async (data, leadForm) => {
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
    try {
      const updateCustomer = await getData({
        query: `update salesforce.Contact
         set name = '${name ?? ""}', FirstName = '${
          firstName ?? ""
        }', MiddleName = '${middleName ?? ""}', LastName = '${
          lastName ?? ""
        }', Company__c = '${company ?? ""}',Email = '${
          email ?? ""
        }',Whatsapp_number__c = '${whatsAppNumber ?? 0}',
          Lead_Type__c = '${leadType ?? ""}',Lead_Source__c = '${
          leadSource ?? ""
        }',Lead_Status__c = '${leadStatus ?? ""}',Sub_Lead_Source__c = '${
          subLeadSource ?? ""
        }',Lead_Rating__c = '${rating ?? ""}',
          MailingStreet = '${street ?? ""}',  MailingCity = '${
          city ?? ""
        }' ,MailingState = '${state ?? ""}' ,MailingCountry = '${
          country ?? ""
        }',MailingPostalCode = '${zip ?? ""}',
          Vehicle_no__c = '${vehicleNumber ?? ""}',Fuel_Type__c = '${
          fuelType ?? ""
        }',X3_or_4_Wheeler__c = '${wheeles ?? ""}',Vehicle_Make__c = '${
          vehicleMek ?? ""
        }', Vehicle_Model__c = '${vehicleModel ?? ""}',
          Usage_of_Vehicle__c = '${usage ?? ""}',Engine_Type__c = '${
          vehicleType ?? ""
        }', Daily_Running_Kms__c = ${
          dailyRunning ?? 0
        },Registration_Year__c = '${
          registration ?? "4/5/2019"
        }',Year_of_Manufacturing__c = ${mfg ?? 2010},Chassis_No__c = '${
          chassis ?? ""
        }',
          GST_Number__c = '${
            gstNumber ?? ""
          }',${this.getCustomerConditionalClause(data)}`,
        token: data.token,
      });
      ``;
      console.log(
        "updateCustomer => ",
        this.state.selectedUser.type,
        updateCustomer
      );
      return updateCustomer.result;
    } catch (e) {
      console.log(e);
    }
  };

  getLeadConditionalClause = (data) => {
    const { selectedUser } = this.state;
    if (isDealer()) {
      return `Assigned_Dealer__c = '${
        data.sfid
      }', Assigned_distributor__c=(select Assigned_distributor__c from salesforce.account where sfid like '%${
        data.sfid
      }%') where sfid like '%${selectedUser && selectedUser.sfid}%'`;
    } else {
      return `Accountid = '${data.sfid}' where sfid='%${
        selectedUser && selectedUser.sfid
      }%'`;
    }
  };

  updateLead = async (data, leadForm) => {
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
    const { selectedUser } = this.state;
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
        }', Vehicle_Model__c = '${vehicleModel ?? ""}',
        Usage_of_Vehicle__c = '${usage ?? ""}', Engine__c = '${
          vehicleType ?? ""
        }',
        Daily_Running_Kms__c = ${dailyRunning ?? 0}, Registration_Year__c = '${
          registration ?? "4/5/2019"
        }',
        Year_of_Manufacturing__c = ${mfg ?? 0}, Chassis_No__c = '${
          chassis ?? ""
        }',
        GST_Number__c = '${gstNumber ?? ""}', ${this.getLeadConditionalClause(
          data
        )}`,
        token: data.token,
      });
      ``;
      console.log("updateLead => ", this.state.selectedUser.type, updateLead);
      return updateLead.result;
    } catch (e) {
      console.log(e);
    }
  };

  insertleadForm = async (data, customerId) => {
    const {
      jobCardCheckboxes: jCC,
      complaintCheckboxes: cC,
      selectedUser = null,
    } = this.state;

      const getSFIDofCust = await getData ({
        query: `Select sfid from salesforce.contact where id = ${customerId}`,
        token: data.token,
      });

      console.log("getSFIDofCust:", getSFIDofCust.result);
      const sfid = getSFIDofCust.result[0].sfid;
      // this.setState({ selectedUser: getSFIDofCust.result[0].sfid})
      
    try {
      const query = `INSERT INTO salesforce.job_card__c (customer__c,Lead__c,AIR_FILTER_R_R__c	,BLOCK_PISTON_R_R__c,CARBURETTOR_SERVICE__c,CAR_SCANNING__c,CNG_LEAKAGE_CHECK__c,CNG_SEQ_KIT_TUNE_UP__c,CNG_TUNE_UP__c,COOLANT_REPLACE__c,CYLINDER_BRACKET_R_R__c,CYLINDER_HYDROTESTING__c,CYLINDER_REFITTING__c,CYLINDER_REMOVE__c,CYLINDER_VALVE_R_R__c,DICKY_FLOOR_REPAIR__c,ECM_BRACKET_R_R__c,ECM_R_R__c,EMULATOR_R_R__c,ENGINE_COMPRESSION_CHECK__c,ENGINE_TUNE_UP__c,FILLER_VALVE_REPAIR__c,
        FILLER_VALVE_R_R__c,FUEL_FILTER_R_R__c,FUEL_GAUGE_CORRECTOR_FITMENT__c,FUEL_PUMP_RELAY_R_R__c	,FUEL_PUMP_R_R__c,GAS_FILLTER_R_R__c,GENERAL_LABOUR_CHARGES__c	,GRECO_ACE_KIT_FITTING__c,GRECO_INJECTOR_R_R__c	,GRECO_PRO_KIT_FITTING__c,

        HEIGHT_PAD_FITMENT__c,HIGH_PRESSURE_PIPE_R_R__c,INGNITION_COILS_R_R__c,INGNITION_COIL_CODE_R_R__c,INJECTOR_NOZZLE_R_R__c,KIT_REFITTING__c,KIT_REMOVE__c,KIT_SERVICE__c,LOW_PRESSURE_HOSE_R_R__c,MAF_MAP_SENSOR_CLEAN__c,

        MAP_SENSOR_R_R__c,MIXER_R_R__c,O2_SENSOR_CLEAN__c,O2_SENSOR_R_R__c,OIL_OIL_FILTER_REPLACE__c,PETROL_INJECTOR_R_R__c,PICK_UP_COIL_R_R__c,PRESSURE_GAUGE_R_R__c,RAIL_BRACKET_R_R__c,REDUCER_BRACKET_R_R__c,

        REDUCER_R_R__c,REDUCER_SERVICE__c,SPARK_PLUG_R_R__c,SWITCH_R_R__c,ANNUAL_MAINTAINANACE_CONTRACT__c,TAPPET_COVER_PACKING_REPLACE__c,TAPPET_SETTING__c,TEMPRESURE_SENSOR_R_R__c,THROTTLE_BODY_CLEANING__c,TIMING_ADVANCE_PROCESS_R_R__c,

        VACCUM_HOSE_PIPE_R_R__c,WIRING_REMOVE_REFITTING__c,WIRING_REPAIR__c,X1ST_FREE_SERVICE__c,X1ST_STAGE_REGULATOR_ORING_R_R__c,X1ST_STAGE_REGULATOR_R_R__c,X2ND_FREE_SERVICE__c,X2ND_STAGE_REGUALTOR_R_R__c,X3RD_FREE_SERVICE__c,

        Low_Average_Mileage__c,Late_Starting_Problem__c,Jerking_Missing_Low_Pick__c,Changeover__c,Vehicle_Not_Changing__c,Vehicle_Not_starting__c,Engine_Shutdown__c	,Less_Slow_Gas__c,Check_Engine__c,Petrol_Consumption__c,Noise_after__c,Gas_Leakage__c,Switch_Not_Working_No_lights_on_switch__c,Buzzer_Noise_on_Switch__c
        ) VALUES
        
         ('${
           selectedUser && selectedUser.type === "customer"
             ? selectedUser.sfid
             : isDealer()
             ? ""
             : sfid
         }','${
        selectedUser && selectedUser.type === "lead"
          ? selectedUser.sfid
          : isDealer()
          ? sfid
          : ""
      }',${jCC["AIR FILTER R/R"]},${jCC["BLOCK PISTON R/R"]},${
        jCC["CARBURETTOR SERVICE"]
      },${jCC["CAR SCANNING"]},${jCC["CNG LEAKAGE CHECK"]},${
        jCC["CNG SEQ. KIT TUNE UP"]
      },${jCC["CNG TUNE UP"]},${jCC["COOLANT REPLACE"]},${
        jCC["CYLINDER BRACKET R/R"]
      },${jCC["CYLINDER HYDROTESTING"]},
        ${jCC["CYLINDER REFITTING"]},${jCC["CYLINDER REMOVE"]},${
        jCC["CYLINDER VALVE R/R"]
      },${jCC["DICKY FLOOR REPAIR"]},${jCC["ECM BRACKET R/R"]},${
        jCC["ECM R/R"]
      },${jCC["EMULATOR R/R"]},${jCC["ENGINE COMPRESSION CHECK"]},${
        jCC["ENGINE TUNE UP"]
      },${jCC["FILLER VALVE REPAIR"]},
        ${jCC["FILLER VALVE R/R"]},${jCC["FUEL FILTER R/R"]},${
        jCC["FUEL GAUGE CORRECTOR FITMENT"]
      },${jCC["FUEL PUMP RELAY R/R"]},${jCC["FUEL PUMP R/R"]},${
        jCC["GAS FILLTER R/R"]
      },${jCC["GENERAL LABOUR CHARGES"]},${jCC["GRECO ACE KIT FITTING"]},${
        jCC["GRECO INJECTOR R/R"]
      },${jCC["GRECO PRO KIT FITTING"]},
        ${jCC["HEIGHT PAD FITMENT"]},${jCC["HIGH PRESSURE PIPE R/R"]},${
        jCC["INGNITION COILS R/R"]
      },${jCC["INGNITION COIL CODE R/R"]},${jCC["INJECTOR NOZZLE R/R"]},${
        jCC["KIT REFITTING"]
      },${jCC["KIT REMOVE"]},${jCC["KIT SERVICE"]},${
        jCC["LOW PRESSURE HOSE R/R"]
      },${jCC["MAF/MAP SENSOR CLEAN"]},

        ${jCC["MAP SENSOR R/R"]},${jCC["MIXER R/R"]},${
        jCC["O2 SENSOR CLEAN"]
      },${jCC["O2 SENSOR R/R"]},${jCC["OIL & OIL FILTER REPLACE"]},${
        jCC["PETROL INJECTOR R/R"]
      },${jCC["PICK UP COIL R/R"]},${jCC["PRESSURE GAUGE R/R"]},${
        jCC["RAIL BRACKET R/R"]
      },${jCC["REDUCER BRACKET R/R"]},

        ${jCC["REDUCER R/R"]},${jCC["REDUCER SERVICE"]},${
        jCC["SPARK PLUG R/R"]
      },${jCC["SWITCH R/R"]},${jCC["ANNUAL MAINTAINANACE CONTRACT"]},${
        jCC["TAPPET COVER PACKING REPLACE"]
      },${jCC["TAPPET SETTING"]},${jCC["TEMPRESURE SENSOR R/R"]},${
        jCC["THROTTLE BODY CLEANING"]
      },${jCC["TIMING ADVANCE PROCESS R/R"]},

        ${jCC["VACCUM HOSE PIPE R/R"]},${jCC["WIRING REMOVE & REFITTING"]},${
        jCC["WIRING REPAIR"]
      },${jCC["1ST FREE SERVICE"]},${jCC["1ST STAGE REGULATOR ORING R/R"]},${
        jCC["1ST STAGE REGULATOR R/R"]
      },${jCC["2ND FREE SERVICE"]},${jCC["2ND STAGE REGUALTOR R/R"]},${
        jCC["3RD FREE SERVICE"]
      },

        ${cC["Low Average / Mileage"]}, ${cC["Late Starting Problem"]}, ${
        cC["Jerking / Missing / Low Pick"]
      }, ${cC["Changeover - Switch / Pressure Gauge Ind"]}, ${
        cC["Vehicle Not Changing over to CNG"]
      }, ${cC["Vehicle Not starting in Petrol"]}, ${
        cC["Engine Shutdown in Idleing mode / Return"]
      }, ${cC["Less/Slow Gas Filling in Tank"]}, ${
        cC["Check Engine Light on Cluster"]
      }, ${cC["Petrol Consumption even when car running"]}, ${
        cC["Noise after/due to CNG Kit Fittment"]
      }, ${cC["Gas Leakage / Sound / Smell"]}, ${
        cC["Switch Not Working(No lights on switch)"]
      }, ${cC["Buzzer Noise on Switch"]}

        )`;
      const insertJobCard = await getData({ query, token: data.token });
      console.log("insertJobCard => ", insertJobCard);
      return insertJobCard.result;
    } catch (e) {
      console.log(e);
    }
  };

  insertLead = async (data, leadForm) => {
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
    try {
      const insertLead = await getData({
        query: `INSERT INTO salesforce.Lead
        (name,FirstName,MiddleName,LastName,Email,Company,Whatsapp_number__c,
          Lead_Type__c,LeadSource,Status,Sub_Lead_Source__c,
          Rating,Street,City,State,PostalCode,Country,
          Vehicle_no__c,Fuel_Type__c,X3_or_4_Wheeler__c,Vehicle_Make__c, Vehicle_Model__c,
          Usage_of_Vehicle__c,Engine__c, Daily_Running_Kms__c,Registration_Year__c,Year_of_Manufacturing__c,Chassis_No__c,
          GST_Number__c,Assigned_Dealer__c,RecordTypeId)
         Values('${name ?? ""}','${firstName ?? ""}','${middleName ?? ""}','${
          lastName ?? ""
        }','${email ?? ""}','${company ?? ""}',${whatsAppNumber ?? ""},'${
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
        }','${gstNumber ?? ""}','${
          data.sfid
        }','0121s0000000WE4AAM') RETURNING Id`,
        token: data.token,
      });
      ``;
      console.log("insertLead => ", insertLead);
      return insertLead.result;

    } catch (e) {
      console.log(e);
    }
  };

  getCreatedItem = async (data, leadForm) => {
    const { email } = leadForm;
    const query = `select id, sfid from salesforce.${
      isDealer() ? "lead" : "contact"
    } where email ='${email}'`;
    try {
      const result = await getData({ query, token: data.token });
      return result;
    } catch (error) {}
  };

  // handleJobCardDealerInsert = async () => {
  //   let customerAdd = null;
  //   console.log(this.state.selectedUser);
  //   return;
  //   if (this.state.selectedUser == null) {
  //       const res = await this.InsertJobCardDealer(
  //         loggedInUserDetails,
  //         this.props.leadForm
  //       );
  //       console.log("res:", res);
  //       customerAdd = res[0].id;
  //     // }
  //     console.log(customerAdd);
  //   } else {
  //     if (isDealer()) {
  //       if (this.state.selectedUser.type === "customer") {
  //         await this.updateCustomer(loggedInUserDetails, this.props.leadForm);
  //       } else {
  //         await this.updateLead(loggedInUserDetails, this.props.leadForm);
  //       }
  //     } else {
  //       if (this.state.selectedUser.type === "customer") {
  //         await this.updateCustomer(loggedInUserDetails, this.props.leadForm);
  //       } else {
  //         await this.updateLead(loggedInUserDetails, this.props.leadForm);
  //       }
  //     }
  //   }
  //   this.insertleadForm(loggedInUserDetails, customerAdd);
  //   //  this.props.history.push("/leads")
  // };


  handleJobCardStep = async (data) => {
    console.log("=================handle job card =====================");
    console.log(data);
    console.log("======================================");

    let { gstNumber , compnayName } = data;
    let { token , record_type , sfid } = loggedInUserDetails;
    let { isLeadOrCustomer } = this.state;
    let basicDetailsFormId = this.state.basicDetailsFormRecordId;
    let queryToGetSfid = `Select sfid,name from Salesforce.contact where id=${basicDetailsFormId}`
    let sfidOfRecord = await getData({
            query : queryToGetSfid,
            token: token
          });
      console.log("SFID ====" , sfidOfRecord);
   
      const {
        jobCardCheckboxes: jCC,
        complaintCheckboxes: cC
      } = this.state;
      let query = `INSERT INTO salesforce.job_card__c (customer__c, Company__c, GST_Number__c,AIR_FILTER_R_R__c,BLOCK_PISTON_R_R__c,CARBURETTOR_SERVICE__c,CAR_SCANNING__c,CNG_LEAKAGE_CHECK__c,CNG_SEQ_KIT_TUNE_UP__c,CNG_TUNE_UP__c,COOLANT_REPLACE__c,CYLINDER_BRACKET_R_R__c,CYLINDER_HYDROTESTING__c,CYLINDER_REFITTING__c,CYLINDER_REMOVE__c,CYLINDER_VALVE_R_R__c,DICKY_FLOOR_REPAIR__c,ECM_BRACKET_R_R__c,ECM_R_R__c,EMULATOR_R_R__c,ENGINE_COMPRESSION_CHECK__c,ENGINE_TUNE_UP__c,FILLER_VALVE_REPAIR__c,
        FILLER_VALVE_R_R__c,FUEL_FILTER_R_R__c,FUEL_GAUGE_CORRECTOR_FITMENT__c,FUEL_PUMP_RELAY_R_R__c,FUEL_PUMP_R_R__c,GAS_FILLTER_R_R__c,GENERAL_LABOUR_CHARGES__c,GRECO_ACE_KIT_FITTING__c,GRECO_INJECTOR_R_R__c,GRECO_PRO_KIT_FITTING__c, 
        HEIGHT_PAD_FITMENT__c,HIGH_PRESSURE_PIPE_R_R__c,INGNITION_COILS_R_R__c,INGNITION_COIL_CODE_R_R__c,INJECTOR_NOZZLE_R_R__c,KIT_REFITTING__c,KIT_REMOVE__c,KIT_SERVICE__c,LOW_PRESSURE_HOSE_R_R__c,MAF_MAP_SENSOR_CLEAN__c,
        MAP_SENSOR_R_R__c,MIXER_R_R__c,O2_SENSOR_CLEAN__c,O2_SENSOR_R_R__c,OIL_OIL_FILTER_REPLACE__c,PETROL_INJECTOR_R_R__c,PICK_UP_COIL_R_R__c,PRESSURE_GAUGE_R_R__c,RAIL_BRACKET_R_R__c,REDUCER_BRACKET_R_R__c,
        REDUCER_R_R__c,REDUCER_SERVICE__c,SPARK_PLUG_R_R__c,SWITCH_R_R__c,ANNUAL_MAINTAINANACE_CONTRACT__c,TAPPET_COVER_PACKING_REPLACE__c,TAPPET_SETTING__c,TEMPRESURE_SENSOR_R_R__c,THROTTLE_BODY_CLEANING__c,TIMING_ADVANCE_PROCESS_R_R__c, 
        VACCUM_HOSE_PIPE_R_R__c,WIRING_REMOVE_REFITTING__c,WIRING_REPAIR__c,X1ST_FREE_SERVICE__c,X1ST_STAGE_REGULATOR_ORING_R_R__c,X1ST_STAGE_REGULATOR_R_R__c,X2ND_FREE_SERVICE__c,X2ND_STAGE_REGUALTOR_R_R__c,X3RD_FREE_SERVICE__c,
        Low_Average_Mileage__c,Late_Starting_Problem__c,Jerking_Missing_Low_Pick__c,Changeover__c,Vehicle_Not_Changing__c,Vehicle_Not_starting__c,Engine_Shutdown__c,Less_Slow_Gas__c,Check_Engine__c,Petrol_Consumption__c,Noise_after__c,Gas_Leakage__c,Switch_Not_Working_No_lights_on_switch__c,Buzzer_Noise_on_Switch__c) 
        VALUES (${sfidOfRecord},’${compnayName}’,’${gstNumber}’,
          ${jCC["AIR FILTER R/R"]},${jCC["BLOCK PISTON R/R"]},${
            jCC["CARBURETTOR SERVICE"]
          },${jCC["CAR SCANNING"]},${jCC["CNG LEAKAGE CHECK"]},${
            jCC["CNG SEQ. KIT TUNE UP"]
          },${jCC["CNG TUNE UP"]},${jCC["COOLANT REPLACE"]},${
            jCC["CYLINDER BRACKET R/R"]
          },${jCC["CYLINDER HYDROTESTING"]},
            ${jCC["CYLINDER REFITTING"]},${jCC["CYLINDER REMOVE"]},${
            jCC["CYLINDER VALVE R/R"]
          },${jCC["DICKY FLOOR REPAIR"]},${jCC["ECM BRACKET R/R"]},${
            jCC["ECM R/R"]
          },${jCC["EMULATOR R/R"]},${jCC["ENGINE COMPRESSION CHECK"]},${
            jCC["ENGINE TUNE UP"]
          },${jCC["FILLER VALVE REPAIR"]},
            ${jCC["FILLER VALVE R/R"]},${jCC["FUEL FILTER R/R"]},${
            jCC["FUEL GAUGE CORRECTOR FITMENT"]
          },${jCC["FUEL PUMP RELAY R/R"]},${jCC["FUEL PUMP R/R"]},${
            jCC["GAS FILLTER R/R"]
          },${jCC["GENERAL LABOUR CHARGES"]},${jCC["GRECO ACE KIT FITTING"]},${
            jCC["GRECO INJECTOR R/R"]
          },${jCC["GRECO PRO KIT FITTING"]},
            ${jCC["HEIGHT PAD FITMENT"]},${jCC["HIGH PRESSURE PIPE R/R"]},${
            jCC["INGNITION COILS R/R"]
          },${jCC["INGNITION COIL CODE R/R"]},${jCC["INJECTOR NOZZLE R/R"]},${
            jCC["KIT REFITTING"]
          },${jCC["KIT REMOVE"]},${jCC["KIT SERVICE"]},${
            jCC["LOW PRESSURE HOSE R/R"]
          },${jCC["MAF/MAP SENSOR CLEAN"]},
    
            ${jCC["MAP SENSOR R/R"]},${jCC["MIXER R/R"]},${
            jCC["O2 SENSOR CLEAN"]
          },${jCC["O2 SENSOR R/R"]},${jCC["OIL & OIL FILTER REPLACE"]},${
            jCC["PETROL INJECTOR R/R"]
          },${jCC["PICK UP COIL R/R"]},${jCC["PRESSURE GAUGE R/R"]},${
            jCC["RAIL BRACKET R/R"]
          },${jCC["REDUCER BRACKET R/R"]},
    
            ${jCC["REDUCER R/R"]},${jCC["REDUCER SERVICE"]},${
            jCC["SPARK PLUG R/R"]
          },${jCC["SWITCH R/R"]},${jCC["ANNUAL MAINTAINANACE CONTRACT"]},${
            jCC["TAPPET COVER PACKING REPLACE"]
          },${jCC["TAPPET SETTING"]},${jCC["TEMPRESURE SENSOR R/R"]},${
            jCC["THROTTLE BODY CLEANING"]
          },${jCC["TIMING ADVANCE PROCESS R/R"]},
    
            ${jCC["VACCUM HOSE PIPE R/R"]},${jCC["WIRING REMOVE & REFITTING"]},${
            jCC["WIRING REPAIR"]
          },${jCC["1ST FREE SERVICE"]},${jCC["1ST STAGE REGULATOR ORING R/R"]},${
            jCC["1ST STAGE REGULATOR R/R"]
          },${jCC["2ND FREE SERVICE"]},${jCC["2ND STAGE REGUALTOR R/R"]},${
            jCC["3RD FREE SERVICE"]
          },
    
            ${cC["Low Average / Mileage"]}, ${cC["Late Starting Problem"]}, ${
            cC["Jerking / Missing / Low Pick"]
          }, ${cC["Changeover - Switch / Pressure Gauge Ind"]}, ${
            cC["Vehicle Not Changing over to CNG"]
          }, ${cC["Vehicle Not starting in Petrol"]}, ${
            cC["Engine Shutdown in Idleing mode / Return"]
          }, ${cC["Less/Slow Gas Filling in Tank"]}, ${
            cC["Check Engine Light on Cluster"]
          }, ${cC["Petrol Consumption even when car running"]}, ${
            cC["Noise after/due to CNG Kit Fittment"]
          }, ${cC["Gas Leakage / Sound / Smell"]}, ${
            cC["Switch Not Working(No lights on switch)"]
          }, ${cC["Buzzer Noise on Switch"]}    
          )
        `
        let addJobCardRes = await getData({
          query : queryToGetSfid,
          token: token
        })
        console.log("#######################################################");
        console.log(addJobCardRes);
        console.log("#######################################################");

        if(addJobCardRes.status == 200 && addJobCardRes.result){
          alert("New Job Card Added Successfully");
          if(isLeadOrCustomer === "leads"){
            this.props.history.push({pathname: "/leads"});
          }
          if(isLeadOrCustomer === "customers"){
            this.props.history.push({pathname: "/customers"});
          }
        }

  };


  handleToggle = (type: string) => (event, isInputChecked) => {
    let fieldName = event.target.name;
    let jobCardCheckboxes = this.state[type];
    jobCardCheckboxes[fieldName] = isInputChecked;
    const jobCardCheckboxesChanged = !this.state.jobCardCheckboxesChanged;
    const obj = {
      jobCardCheckboxesChanged,
      [type]: jobCardCheckboxes,
    };
    this.setState(obj);
  };

  formatDate = () => {
    let d = new Date();
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

  handleBasicDetailsFormSubmit = async (obj : any) => {
   this.setState({ basicDetailsFormRecordId : "" });

  
    let {
      chassis,city, company, country, dailyRunning, email, firstName, fuelType, gstNumber, lastName, leadSource, 
      leadStatus,leadType,mfg, middleName, rating, registration, state, street, subLeadSource, subleadType, usage, 
      vehicleMek, vehicleModel, vehicleNumber , vehicleType, whatsAppNumber, wheeles, zip
    } = obj;

    let { token , record_type , sfid } = loggedInUserDetails;

    if(isDealer()){
        if(!this.state.selectedUser){
          alert("dealer selected no option from dropdown");
          let queryToGetAssignedDist = `select Assigned_distributor__c from salesforce.account where sfid like '%${sfid}%'`;
          let assignedDistRes = await getData({
            query : queryToGetAssignedDist,
            token: token
          });
          let assignedDist = assignedDistRes.result[0].assigned_distributor__c;

          console.log(assignedDist);
          let query = `INSERT INTO salesforce.Contact (FirstName, MiddleName, LastName, Company__c,Email,Whatsapp_number__c,Lead_Type__c,Lead_Source__c,Lead_Status__c,Sub_Lead_Source__c,Lead_Rating__c,MailingStreet,MailingCity,MailingState,MailingCountry,MailingPostalCode,Vehicle_no__c,Fuel_Type__c,X3_or_4_Wheeler__c,Vehicle_Make__c,Vehicle_Model__c,Usage_of_Vehicle__c,Engine_Type__c,Daily_Running_Kms__c,Registration_Year__c,Year_of_Manufacturing__c,Chassis_No__c,GST_Number__c,accountid,RecordTypeId,Assigned_Dealer__c)
          values('${firstName}', '${middleName}', '${lastName}' , '${company}' , '${email}' , ${whatsAppNumber} , '${leadType}' , '${leadSource}' , '${leadStatus}' , '${subLeadSource}' ,'${rating}','${street}','${city}','${state}','${country}',${zip},'${vehicleNumber}','${fuelType}','${wheeles}','${vehicleMek}','${vehicleModel}','${usage}','${vehicleType}',${dailyRunning},'${registration}',${mfg},'${gstNumber}','${chassis}','${assignedDist}', '0121s0000000WE4AAM' , '${sfid}') Returning Id`;    
          try {
            let res;
            res = await getData({
            query : query,
            token: token
          });
          console.log(">>>>>>>>>>> Basic Details Insert Result >>>>>>>>>>>>>>>>>>>>>>>");
          console.log(res);
          console.log(">>>>>>>>>>>End Basic Details Insert Result >>>>>>>>>>>>>>>>>>>>>>>");
          if(res.status === 200 && res.result){
            alert("Successfully added record");
            this.setState({
              activeStep: this.state.activeStep + 1,
              basicDetailsFormRecordId : res.result[0].id,
              isLeadOrCustomer : "leads"
            })
          }
          else { alert("failed to add as dealer");  }
          }
          catch(err) {
              console.log(err);
          }
        }
        else {
          alert("dealer selected option from dropdown");
          let { selectedUser } = this.state;
          let { sfid , type } = selectedUser;
          console.log(type);
          if(type === "customer"){
            alert("And selected customer");
            let updateQuery = `update salesforce.Contact set FirstName='${firstName}', MiddleName='${middleName}', LastName='${lastName}', Company__c='${company}',Email='${email}',Whatsapp_number__c=${whatsAppNumber},Lead_Type__c='${leadType}',Lead_Source__c='${leadSource}',Lead_Status__c='${leadStatus}',Sub_Lead_Source__c ='${subLeadSource}'  ,Lead_Rating__c='${rating}',  MailingStreet='${street}',  MailingCity='${city}' ,MailingState='${state}' ,MailingCountry='${country}',MailingPostalCode =${zip}, Vehicle_no__c='${vehicleNumber}',Fuel_Type__c='${fuelType}',X3_or_4_Wheeler__c='${wheeles}',Vehicle_Make__c='${vehicleMek}', Vehicle_Model__c='${vehicleModel}',Usage_of_Vehicle__c='${usage}',Engine_Type__c='${vehicleType}', Daily_Running_Kms__c=${dailyRunning},Registration_Year__c='${registration}',Year_of_Manufacturing__c=${mfg},Chassis_No__c='${chassis}',  GST_Number__c='${gstNumber}'   where sfid like '${sfid}' Returning Id`;
            try {
              let res;
              res = await getData({
              query : updateQuery,
              token: token
            });
            console.log(res);
            if(res.status === 200 && res.result){
              alert("Successfully updated record");
              this.setState({
                activeStep: this.state.activeStep + 1,
                basicDetailsFormRecordId : res.result[0].id,
                isLeadOrCustomer : "customers"
              })
            }
            else { alert("failed to update customer as dealer");  }
         }
         catch(err) {
           alert("something went wrong");
           console.log(err);
         }
          }
          else {
              alert("And selected lead");
             let updateQuery  = `update salesforce.Lead set FirstName='${firstName}', MiddleName='${middleName}', LastName='${lastName}', Company='${company}',Email='${email}',Whatsapp_number__c=${whatsAppNumber},Lead_Type__c='${leadType}',LeadSource='${leadSource}',Status='${leadStatus}',Sub_Lead_Source__c='${subLeadSource}' ,Rating='${rating}',  Street='${street}',  City='${city}' ,State='${state}' ,Country='${country}',PostalCode=${zip}, Vehicle_no__c='${vehicleNumber}',Fuel_Type__c='${fuelType}',X3_or_4_Wheeler__c='${wheeles}',Vehicle_Make__c='${vehicleMek}', Vehicle_Model__c='${vehicleModel}',Usage_of_Vehicle__c='${usage}',Engine__c='${vehicleType}', Daily_Running_Kms__c=${dailyRunning},Registration_Year__c='${registration}',Year_of_Manufacturing__c=${mfg},Chassis_No__c='${chassis}',  GST_Number__c ='${gstNumber}' where sfid like '${sfid}' Returning Id`;
              try {
                let res;
                res = await getData({
                query : updateQuery,
                token: token
              });
              console.log(res);
              if(res.status === 200 && res.result){
                alert("Successfully updated record");
                this.setState({
                  activeStep: this.state.activeStep + 1,
                  basicDetailsFormRecordId : res.result[0].id,
                  isLeadOrCustomer : "leads",
                })
              }
              else { alert("failed to update lead as dealer");  }
           }
           catch(err) {
             alert("something went wrong");
             console.log(err);
           }
          }
        }
    }
    // else {
    //   alert("you are dealing with distributor account");
    //   if(!this.state.selectedUser){
    //     alert("Distributor , No Option is selected");
    //     let query = `INSERT INTO salesforce.Contact (FirstName, MiddleName, LastName, Company__c,Email,Whatsapp_number__c,Lead_Type__c,Lead_Source__c,Lead_Status__c,Sub_Lead_Source__c,Lead_Rating__c,MailingStreet,MailingCity,MailingState,MailingCountry,MailingPostalCode,Vehicle_no__c,Fuel_Type__c,X3_or_4_Wheeler__c,Vehicle_Make__c,Vehicle_Model__c,Usage_of_Vehicle__c,Engine_Type__c,Daily_Running_Kms__c,Registration_Year__c,Year_of_Manufacturing__c,Chassis_No__c,GST_Number__c,accountid,RecordTypeId)
    //     values('${firstName}', '${middleName}', '${lastName}' , '${company}' , '${email}' , ${whatsAppNumber} , '${leadType}' , '${leadSource}' , '${leadStatus}' , '${subLeadSource}' ,'${rating}','${street}','${city}','${state}','${country}',${zip},'${vehicleNumber}','${fuelType}','${wheeles}','${vehicleMek}','${vehicleModel}','${usage}','${vehicleType}',${dailyRunning},'${registration}',${mfg},'${gstNumber}','${chassis}','${sfid}', '${record_type}') Returning Id`;    
    //     try {
    //       let res;
    //        res = await getData({
    //        query,
    //        token: token
    //      });
    //      console.log(res);
    //      if(res.status === 200 && res.result){
    //        alert("Successfully added new record");
    //        this.setState({
    //          activeStep: this.state.activeStep + 1,
    //          basicDetailsFormRecordId : res.result[0].id
    //        })
    //      }
    //      else { alert("failed to insert");  }
    //    }
    //    catch(err) {
    //      alert("something went wrong");
    //      console.log(err);
    //    }
    //   }
    //   else {
    //     let sfid = this.state.selectedUser.sfid;
    //     alert("Distributor , Some Option is selected");
    //     let updateQuery = `update salesforce.Contact set FirstName='${firstName}', MiddleName='${middleName}', LastName='${lastName}', Company__c='${company}',Email='${email}',Whatsapp_number__c=${whatsAppNumber},Lead_Type__c='${leadType}',Lead_Source__c='${leadSource}',Lead_Status__c='${leadStatus}',Sub_Lead_Source__c ='${subLeadSource}'  ,Lead_Rating__c='${rating}',  MailingStreet='${street}',  MailingCity='${city}' ,MailingState='${state}' ,MailingCountry='${country}',MailingPostalCode =${zip}, Vehicle_no__c='${vehicleNumber}',Fuel_Type__c='${fuelType}',X3_or_4_Wheeler__c='${wheeles}',Vehicle_Make__c='${vehicleMek}', Vehicle_Model__c='${vehicleModel}',Usage_of_Vehicle__c='${usage}',Engine_Type__c='${vehicleType}', Daily_Running_Kms__c=${dailyRunning},Registration_Year__c='${registration}',Year_of_Manufacturing__c=${mfg},Chassis_No__c=${chassis},  GST_Number__c='${gstNumber}'   where sfid like '${sfid}' Returning Id`;
    //     try {
    //       let res;
    //        res = await getData({
    //        query : updateQuery,
    //        token: token
    //      });
    //      console.log(res);
    //      if(res.status === 200 && res.result){
    //        alert("Successfully updated record");
    //        this.setState({
    //          activeStep: this.state.activeStep + 1,
    //          basicDetailsFormRecordId : res.result[0].id
    //        })
    //      }
    //      else { alert("failed to update lead as distributor");  }
    //    }
    //    catch(err) {
    //      alert("something went wrong");
    //      console.log(err);
    //    }
    //   }
    // }

  }

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
            // onSubmit={(v: any) => {
            //   alert("hello");
            //   // this.setState({
            //   //   activeStep: this.state.activeStep + 1,
            //   // });
            //   console.log(">> v", v);

            // }}
            onSubmit = { this.handleBasicDetailsFormSubmit }
            formModel="leadForm"
            hasSubmit={true}
            options={vehicleInputs}
            submitTitle="Next"
            allFormOptions={[
              ...options,
              ...vehicleInputs,
              ...streetInputs,
              ...leadSource,
            ]}
            cancelTitle="Close"
            onCancel={() => this.setState({ OpenAddJobCard: false })}
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
  /* renderDocsForRTO = () => {
    return (
      <React.Fragment>
        <SubFormHeading >
          Documents Required for RTO
        </SubFormHeading>
        <UploadContainer valKey={1} heading="Original R.C. Book" />
        <UploadContainer
          valKey={2}
          heading="Bank NOC In case of Hypothecation"
        />
        <UploadContainer valKey={3} heading="Valid Insurance Photocopy" />
        <UploadContainer valKey={4} heading="Permit" />
        <UploadContainer valKey={5} heading="Tax" />
        <UploadContainer valKey={6} heading="Passing" />
        <SubFormHeading >
          KYC Documents
        </SubFormHeading>
        <UploadContainer valKey={7} heading="Aadhaar Card" />
        <UploadContainer valKey={8} heading="PAN Card" />{" "}
        <FormComponent
          onSubmit={(v: any) => {
            console.log(">> v", v);
            this.setState({
              activeStep: this.state.activeStep + 1,
            });
          }}
          formModel="leadForm"
          hasSubmit={true}
          options={[]}
          submitTitle="Next"
          cancelTitle="Previous"
        />
      </React.Fragment>
    );
  };
 */
  // Negotiation Form
  /*   renderNegotitation = () => {
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
          onSubmit={(v: any) => {
            this.setState({
              activeStep: this.state.activeStep + 1,
            });
            console.log(">> v", v);
          }}
          submitTitle="Next"
          cancelTitle="Previous"
          formModel="leadForm"
          hasSubmit={true}
          options={[]}
        />
      </div>
    );
  }; */

  // Closed
  /* renderClosedTab = () => {
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
          onSubmit={(v: any) => {
            console.log(">> v", v);
            this.setState({
              activeStep: this.state.activeStep + 1,
            });
          }}
          formModel="leadForm"
          hasSubmit={true}
          options={[]}
          submitTitle="Next"
          cancelTitle="Previous"
        />
      </div>
    );
  }; */

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
            {Object.keys(this.state.complaintCheckboxes).map((key, value) => {
              const isChecked = this.state.jobCardCheckboxesChanged[key];
              return (
                <React.Fragment>
                  <Grid key={key} className="checkbox-container" item xs={6} md={6} lg={6} sm={6}> 
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", }} >
                      {/* <div className="label-text" >{key}</div> */}
                      <div>
                        <Checkbox 
                          color="primary" inputProps={{ "aria-label": "secondary checkbox" }}
                          style={{ width: '10px', height: '10px'}}
                          onChange={this.handleToggle('complaintCheckboxes')} key={key} name={key} value={isChecked}
                          {...this.state.id && { checked: isChecked }}
                        /> 
                        {key}
                      </div>
                    </div>
                  </Grid>
                  <Grid></Grid>
                </React.Fragment>
              );
            })}
          </Grid>
        </div>
        <div>
          <SubFormHeading>Job Card</SubFormHeading>
          <Grid container>
            {Object.keys(this.state.jobCardCheckboxes).map((key, value) => {
              const isChecked = this.state.jobCardCheckboxesChanged[key];
              return (
                <React.Fragment>
                  <Grid key={key} className="checkbox-container" item xs={6} md={6} lg={6} sm={6}>
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
                          style={{ width: '10px', height: '10px'}}
                          inputProps={{ "aria-label": "secondary checkbox" }}
                          onChange={this.handleToggle("jobCardCheckboxes")}
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
            // this.handleJobCardDealerInsert();
            this.handleJobCardStep(this.props.leadForm);
          }}
          formModel="leadForm"
          hasSubmit={true}
          submitTitle="Save"
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
              <Grid item xs={12} md={12} lg={12}>
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
            <Grid xs={12} md={5} sm={5}>
              <GSelect
                className="r-select"
                placeholder="Subject"
                options={products}
              />
            </Grid>{" "}
            <span style={{ padding: "10px" }} />
            <Grid xs={12} md={5} sm={5}>
              <input type="date" className="r-select" />{" "}
            </Grid>
          </div>
        </Grid>
        <Grid container spacing={4}>
          <div className="product-selection">
            <Grid xs={12} md={5} sm={5}>
              <GSelect
                className="r-select"
                placeholder="Rating"
                options={products}
              />
            </Grid>{" "}
            <span style={{ padding: "10px" }} />
            <Grid xs={12} md={5} sm={5}>
              <GSelect
                className="r-select"
                placeholder="Status"
                options={products}
              />{" "}
            </Grid>
          </div>
        </Grid>
        <Grid container spacing={4}>
          <div className="product-selection">
            <Grid xs={12} md={5} sm={5}>
              <GSelect
                className="r-select"
                placeholder="Call Result"
                options={products}
              />
            </Grid>{" "}
            <span style={{ padding: "10px" }} />
            <Grid xs={12} md={5} sm={5}>
              <TextField
                multiline
                rows={3}
                className="r-select textarea-full"
                placeholder="Comments"
                variant="outlined"
              />{" "}
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
            Save
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
        activeStep={this.state.activeStep}
        onChangeStep={(x) => this.setState({ activeStep: x })}
        stepData={[
          {
            label: "Basic Details",
            component: this.renderForm(),
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

  dealerChange = ({ obj }) => {
    const newData = {
      email: obj.email,
      firstName: obj.firstname,
      lastName: obj.lastname,
      middleName: obj.middlename,
      company: obj.company,
      whatsAppNumber: obj.whatsapp_number__c,
      leadType: obj.lead_type__c,
      leadSource: obj.leadsource,
      leadStatus: obj.status,
      subLeadSource: obj.sub_lead_source__c,
      rating: obj.rating,
      street: obj.street,
      city: obj.city,
      state: obj.state,
      zip: obj.postalcode,
      country: obj.country,
      vehicleNumber: obj.vehicle_no__c,
      fuelType: obj.fuel_type__c,
      wheeles: obj.x3_or_4_wheeler__c,
      vehicleMek: obj.vehicle_make__c,
      vehicleModel: obj.vehicle_model__c,
      usage: obj.usage_of_vehicle__c,
      vehicleType: obj.engine__c,
      dailyRunning: obj.daily_running_kms__c,
      registration: obj.registration_year__c,
      mfg: obj.year_of_manufacturing__c,
      chassis: obj.chassis_no__c,
      gstNumber: obj.gst_number__c,
    };
      // DEFAULT VALUES
      if(!newData.registration){
        newData.registration = this.formatDate();
      }
      for(let key in newData){
          if(!newData[key]){
              if(key === "whatsAppNumber" || key === "zip" || key === "dailyRunning" || key === "mfg"){
                newData[key] = 0;
              }
              else if(key === "email"){
                newData[key] = "abc@gmail.com"
              }
              else {
                newData[key] = "";
              }
          }
      }
    // END DEFAULT VALUES
  
    changeValuesInStore("leadForm", newData);
   
    console.log(obj);
    this.setState({ selectedUser: obj });
  };

  render() {
    return (
      <AppBar>
        <div
          // className="card-container no-hover add-leads-page"
          // style={{ paddingBottom: 500 }}
        >
          {this.renderModal()}
          {!this.state.OpenAddJobCard && (
            <div className="card-container no-hover add-leads-page">
              <Select
                className="r-select"
                classNamePrefix="r-select-pre"
                placeholder="Select Customer / Lead"
                options={this.state.allCustAndLeads.map((p) => ({
                  label: p.name,
                  value: p.sfid,
                  obj: p,
                }))}
                onChange={this.dealerChange}
              />
            </div>
          )}
          {/* <Grid container>
          {!this.state.OpenAddJobCard && (
              this.state.AllJobCards && this.state.AllJobCards.map(cust => {
              return (
                <Grid item xs={12} md={6}>
                  <JobCardsList
                    // onClickDetails={this.handleCustomerDetails}
                    jobCardData={cust}
                  />
                </Grid>
              )})
            )}
          </Grid> */}
          {this.state.OpenAddJobCard && (
            <div className="">
              {/* <Typography variant="h5" color="inherit">
                Add New JobCard
              </Typography> */}

              {this.renderStepper()}
            </div>
          )}
        </div>
        {!this.state.OpenAddJobCard && (
          <span
            onClick={() => this.setState({ OpenAddJobCard: true })}
            style={{ position: "absolute", right: 20, bottom: 20 }}
          >
            <Fab color="secondary" aria-labelledby="add-ticket">
              <Add />
            </Fab>
          </span>
        )}
      </AppBar>
    );
  }
}
export function mapStateToProps(state) {
  const { leadForm } = state.rxFormReducer;
  return { leadForm };
}
export const AddNewJobCard = connect<{}, {}, IAddNewJobCardProps>(
  mapStateToProps
)(AddNewJobCardImpl);

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

export const JobCardsList = (props: any) => {
  const { jobCardData } = props;
  return (
    <div className="card-container" >
      <Grid container > 
        <Grid item className="padding-6-corners" xs={6} md={6} >
          <PersonPin /> <span style={{ padding: "5px" }} />
          <div style={{marginTop: '-25px', marginLeft: '25px'}}>
            {jobCardData.firstname} {jobCardData.lastname}
          </div>
        </Grid>
        <Grid className="padding-6-corners" item xs={6} md={6}>
          <Phone /> <span style={{ padding: "5px" }} />
          <div style={{marginTop: '-25px', marginLeft: '25px'}}>
            {jobCardData.whatsapp_number__c && ChangePhoneFormat(jobCardData.whatsapp_number__c)}
          </div>
        </Grid>
      </Grid>
      {/* <Grid container >
        <Grid className="padding-6-corners" item xs={6} md={6}>
          <span className="description-text"> Purchased Product:</span>
          {jobCardData.purchased_product__c}
        </Grid>
        <Grid className="padding-6-corners" item xs={6} md={6}>
          <span className="description-text"> Dealer Rating:</span>
          {jobCardData.dealer_rating__c}
        </Grid>
      </Grid> */}
      <Grid container >
        <Grid className="padding-6-corners" item xs={12} md={6}>
          <span className="description-text">Jobcard No:</span>
          {jobCardData.jcname__c || jobCardData.name}
        </Grid>
        {/* <Grid className="padding-6-corners" item xs={4} md={4}> 
        <span onClick={() => props.onClickDetails(jobCardData)} className="view">
          View Details
        </span>
        </Grid> */}
      </Grid>
    </div>
  )
};
