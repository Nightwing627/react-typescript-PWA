import * as React from "react";
import { connect } from "react-redux";
import AppBar from "src/navigation/App.Bar";
import { Grid, Button } from "@material-ui/core";
import { chartData } from "./../AssignedDealers/usersData";
import "./../AssignedDealers/asssignedDealers.scss";
import { Tabs } from "src/components/Tabs";
import { TableWithGrid } from "src/components/TableWithGrid";
import data from "src/data";
import { SubFormHeading } from "src/components/SubFormHeading";
import {
  BarChart,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  Bar,
} from "recharts";
import { isEmpty } from "lodash";
import { withRouter } from "react-router-dom";
import { isDealer } from "./../../state/Utility";
import { ChangePhoneFormat } from "src/components/Format";
import { getToken, IHistory } from "src/state/Utility";
import getData from "src/utils/getData";
import { JobCardsList } from "src/pages/JobCard/index";

export interface IJobCardDetailsProps {
  history: IHistory;
  location: any
}

const columns = [
  {
    label: "Product",
    name: "product",
    options: {
      filter: true,
      sort: false,
    },
  },
  {
    label: "Target",
    name: "target",
    options: {
      filter: true,
      sort: false,
    },
  },
  {
    label: "Date",
    name: "date",
    options: {
      filter: true,
      sort: false,
    },
  },
];
const options = {
  filterType: "checkbox",
  responsive: "scrollMaxHeight",
};

export class JobCardDetailsImpl extends React.PureComponent<
  any,
  { users: any; isLoading: boolean; AllJobCards: any; complaintList: any; jobCardLlist: any;}
> {
  constructor(props: IJobCardDetailsProps) {
    super(props);
    this.state = { users: [], isLoading: false, AllJobCards: null, complaintList: null, jobCardLlist: null };
  }

  async componentDidMount() {
    const data = getToken().data;
    const details = await this.getAllJobCards(data);
    console.log("details: ", details)
    this.setState({ AllJobCards : details });

    const complist = [];
    complist.push({label: "Low Average / Mileage", value: details.low_average_mileage__c},
            {label: "Late Starting Problem", value: details.late_starting_problem__c},
            {label: "Jerking / Missing / Low Pick", value: details.jerking_missing_low_pick__c},
            {label: "Changeover - Switch / Pressure Gauge Ind", value: details.changeover__c},
            {label: "Vehicle Not Changing over to CNG", value: details.vehicle_not_changing__c},
            {label: "Vehicle Not starting in Petrol", value: details.vehicle_not_starting__c},
            {label: "Engine Shutdown in Idleing mode / Return", value: details.engine_shutdown__c},
            {label: "Less/Slow Gas Filling in Tank", value: details.less_slow_gas__c},
            {label: "Check Engine Light on Cluster", value: details.check_engine__c},
            {label: "Petrol Consumption even when car running", value: details.petrol_consumption__c},
            {label: "Noise after/due to CNG Kit Fittment", value: details.noise_after__c},
            {label: "Gas Leakage / Sound / Smell", value: details.gas_leakage__c}, 
            {label: "Switch Not Working(No lights on switch)", value: details.switch_not_working_no_lights_on_switch__c},
            {label: "Buzzer Noise on Switch", value: details.buzzer_noise_on_switch__c},);
    this.setState({complaintList: complist});

    const joblist = [];
    joblist.push({label: "ANNUAL MAINTAINANACE CONTRACT", value: details.annual_maintainanace_contract__c},
            {label: "AIR FILTER R/R", value: details.air_filter_r_r__c},
            {label: "BLOCK PISTON R/R", value: details.block_piston_r_r__c},
            {label: "CNG TUNE UP", value: details.cng_tune_up__c},
            {label: "CYLINDER REMOVE", value: details.cylinder_remove__c},
            {label: "CYLINDER REFITTING", value: details.cylinder_refitting__c},
            {label: "CARBURETTOR SERVICE", value: details.carburettor_service__c},
            {label: "CAR SCANNING", value: details.car_scanning__c},
            {label: "CNG LEAKAGE CHEC", value: details.cng_leakage_check__c},
            {label: "CNG SEQ. KIT TUNE UP", value: details.cng_seq_kit_tune_up__c},
            {label: "COOLANT REPLACE", value: details.coolant_replace__c},
            {label: "CYLINDER BRACKET R/R", value: details.cylinder_bracket_r_r__c},
            {label: "CYLINDER HYDROTESTING", value: details.cylinder_hydrotesting__c},
            {label: "CYLINDER VALVE R/R", value: details.cylinder_valve_r_r__c},
            {label: "DICKY FLOOR REPAIR", value: details.dicky_floor_repair__c},
            {label: "ECM BRACKET R/R", value: details.ecm_bracket_r_r__c},
            {label: "ECM R/R", value: details.ecm_r_r__c},
            {label: "EMULATOR R/R", value: details.emulator_r_r__c},
            {label: "ENGINE COMPRESSION CHECK", value: details.engine_compression_check__c},
            {label: "ENGINE TUNE Up", value: details.engine_tune_up__c},
            {label: "FILLER VALVE REPAIR", value: details.filler_valve_repair__c},
            {label: "FILLER VALVE R/R", value: details.filler_valve_r_r__c},
            {label: "FUEL FILTER R/R", value: details.fuel_filter_r_r__c},
            {label: "FUEL GAUGE CORRECTOR FITMENT", value: details.fuel_gauge_corrector_fitment__c},
            {label: "FUEL PUMP RELAY R/R", value: details.fuel_pump_relay_r_r__c},
            {label: "FUEL PUMP R/R", value: details.fuel_pump_r_r__c},
            {label: "GRECO ACE KIT FITTING", value: details.greco_ace_kit_fitting__c},
            {label: "GRECO PRO KIT FITTING", value: details.greco_pro_kit_fitting__c},
            {label: "GAS FILLTER R/R", value: details.gas_fillter_r_r__c},
            {label: "GENERAL LABOUR CHARGES", value: details.general_labour_charges__c},
            {label: "GRECO INJECTOR R/R", value: details.greco_injector_r_r__c},
            {label: "HEIGHT PAD FITMENT", value: details.height_pad_fitment__c},
            {label: "HIGH PRESSURE PIPE R/R", value: details.high_pressure_pipe_r_r__c},
            {label: "INGNITION COILS R/R", value: details.ingnition_coils_r_r__c},
            {label: "INGNITION COIL CODE R/R", value: details.ingnition_coil_code_r_r__c},
            {label: "INJECTOR NOZZLE R/R", value: details.injector_nozzle_r_r__c},
            {label: "KIT REMOVE", value: details.kit_remove__c},
            {label: "KIT SERVICE", value: details.kit_service__c},
            {label: "KIT REFITTING", value: details.kit_refitting__c},
            {label: "LOW PRESSURE HOSE R/R", value: details.low_pressure_hose_r_r__c},
            {label: "MAF/MAP SENSOR CLEAN", value: details.maf_map_sensor_clean__c},
            {label: "MAP SENSOR R/R", value: details.map_sensor_r_r__c},
            {label: "MIXER R/R", value: details.mixer_r_r__c},
            {label: "O2 SENSOR CLEAN", value: details.o2_sensor_clean__c},
            {label: "O2 SENSOR R/R", value: details.o2_sensor_r_r__c},
            {label: "OIL & OIL FILTER REPLACE", value: details.oil_oil_filter_replace__c},
            {label: "PETROL INJECTOR R/R", value: details.petrol_injector_r_r__c},
            {label: "PICK UP COIL R/R", value: details.pick_up_coil_r_r__c},
            {label: "PRESSURE GAUGE R/R", value: details.pressure_gauge_r_r__c},
            {label: "RAIL BRACKET R/R", value: details.rail_bracket_r_r__c},
            {label: "REDUCER BRACKET R/R", value: details.reducer_bracket_r_r__c},
            {label: "REDUCER R/R", value: details.reducer_r_r__c},
            {label: "REDUCER SERVICE", value: details.reducer_service__c},
            {label: "SPARK PLUG R/R", value: details.spark_plug_r_r__c},
            {label: "SWITCH R/R", value: details.switch_r_r__c},
            {label: "TAPPET COVER PACKING REPLACE", value: details.tappet_cover_packing_replace__c},
            {label: "TAPPET SETTING", value: details.tappet_setting__c},
            {label: "TEMPRESURE SENSOR R/R", value: details.tempresure_sensor_r_r__c},
            {label: "THROTTLE BODY CLEANING", value: details.throttle_body_cleaning__c},
            {label: "TIMING ADVANCE PROCESS R/R", value: details.timing_advance_process_r_r__c},
            {label: "VACCUM HOSE PIPE R/R", value: details.vaccum_hose_pipe_r_r__c},
            {label: "WIRING REMOVE & REFITTING", value: details.wiring_remove_refitting__c},
            {label: "WIRING REPAIR", value: details.wiring_repair__c},
            {label: "1ST FREE SERVICE", value: details.x1st_free_service__c},
            {label: "1ST STAGE REGULATOR ORING R/R", value: details.x1st_stage_regulator_oring_r_r__c},
            {label: "1ST STAGE REGULATOR R/R", value: details.x1st_stage_regulator_r_r__c},
            {label: "2ND FREE SERVICE", value: details.x2nd_free_service__c},
            {label: "2ND STAGE REGUALTOR R/R", value: details.x2nd_stage_regualtor_r_r__c},
            {label: "3RD FREE SERVICE", value: details.x3rd_free_service__c});

    this.setState({ jobCardLlist: joblist });
}

  getAllJobCards = async (data) => {
    const {params} = this.props.match;
    console.log("this.props", this.props)
    let sfid = data.sfid;
    if(params && params.sfid){
      sfid = params.sfid;
    }

    try{
      const jobCardData = await getData({
        query: `SELECT * FROM salesforce.job_card__c WHERE sfid like '%${sfid}%'`,
        token: data.token
      })

      console.log("jobCardData =>", jobCardData)
      return jobCardData.result[0];
     
    }
    catch(e){
      console.log(e);
    }
  }

  tabData = () => [
    {
      tabName: "Details",
      component: (
        <Grid container>
          {this.state.AllJobCards && 
          <Grid item xs={12} md={12} lg={12}>
            <div className="card-container">
              <SubFormHeading>Basic & GST Details</SubFormHeading>
              <Grid container>
                {" "}
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Job Card Number:</span>
                  {this.state.AllJobCards.name}
                </Grid>
                {/* <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Mobile:</span>
                  {this.state.AllJobCards.phone && ChangePhoneFormat(this.state.AllJobCards.phone)}
                </Grid> */}
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">GST Number:</span>
                  {this.state.AllJobCards.gst_number__c}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Company:</span>
                  {this.state.AllJobCards.company__c || this.state.AllJobCards.company}
                </Grid>
              </Grid>
              <SubFormHeading>Complaint List</SubFormHeading>
              {this.state.complaintList && this.state.complaintList.map(cl => {
                if(cl.value === "t"){
                return(
                  <Grid item className="padding-6" xs={12} md={12} lg={12} sm={12}>
                    <span className="description-text">{cl.label}</span>
                  </Grid>
                )}
              })}
              <SubFormHeading>Job Card List</SubFormHeading>
              {this.state.jobCardLlist && this.state.jobCardLlist.map(jbl => {
                if(jbl.value === "t"){
                return(
                  <Grid item className="padding-6" xs={12} md={12} lg={12} sm={12}>
                    <span className="description-text">{jbl.label}</span>
                  </Grid>
                )}
              })}
                

            </div>
          </Grid>
          }
        </Grid>
      ),
    }
  ];

  render() {
    // const arr = [];
    // arr.push({label: "air_filter_r_r__c", value: this.state.AllJobCards.air_filter_r_r__c}, {label: "car_scanning__c", value: this.state.AllJobCards.car_scanning__c})
    // console.log("arr: ", arr)
    return (
      <AppBar>
        {/* <div style={{ padding: "20px" }}> */}
          <Tabs tabsData={this.tabData()} />
        {/* </div> */}
      </AppBar>
    );
  }
}
export function mapStateToProps(state) {
  return { dealerDetails: state.users.get("data") };
}
export const JobCardDetails = withRouter(
  connect<{}, {}, IJobCardDetailsProps>(mapStateToProps)(
    JobCardDetailsImpl
  ) as any
);

const distDetails = {
  name: "Sachin T",
  accountName: "GGFS",
  whatApp: "",
  email: "sadas@qdasdas.com",
  mobile: "32321321321",
  rating: "3.5",
  billingAddress: "Indiabulls, Lower Parel, Mumbai, MH",
  shippingAddress: "Indiabulls, Lower Parel, Mumbai, MH 411093, India",
  gstNum: "27AACCN1235323",
  bankName: "HDFC Bank",
  IFSC: "HDFC0000646",
  aaNum: "3242353243",
  custDetails: [
    { custName: "Ramesh T", mobileNumber: "21323231" },
    { custName: "Suresh T", mobileNumber: "21323231" },
  ],
};