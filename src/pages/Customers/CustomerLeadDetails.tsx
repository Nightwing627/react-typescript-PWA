import * as React from "react";
import { connect } from "react-redux";
import AppBar from "src/navigation/App.Bar";
import { Grid } from "@material-ui/core";
import "./../AssignedDealers/asssignedDealers.scss";
import { Tabs } from "src/components/Tabs";
import { SubFormHeading } from "src/components/SubFormHeading";
import { isEmpty } from "lodash";
import { withRouter } from "react-router-dom";
import { isDealer } from "./../../state/Utility";
import { ChangePhoneFormat } from "src/components/Format";
import { getToken, IHistory } from "src/state/Utility";
import getData from "src/utils/getData";
import moment from 'moment';

export interface ICustomerDetailsProps {
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

export class CustomerDetailsImpl extends React.PureComponent<
  any,
  { users: any; isLoading: boolean; AllJobCards: any; detailsData: any;}
> {
  constructor(props: ICustomerDetailsProps) {
    super(props);
    this.state = { users: [], isLoading: false, AllJobCards: null, detailsData: null};
  }

  componentWillMount() {
    console.log("this.props", this.props)
    if (isEmpty(this.props.dealerDetails)) {
      this.props.history.goBack();
    }
  }
  componentDidMount() {
    const data = getToken().data;
    this.getDetailsData(data);
  }

  getDetailsData = async (data) => {
    const {params} = this.props.match;
    console.log("paramas", params)
    let sfid = "";
    let recordtypeid = "";
    if(params && params.recordtypeid && params.sfid){
      sfid = params.sfid;
      recordtypeid = params.recordtypeid;
    }
    try{
      let jobCardData;
      if(recordtypeid === "0121s0000000WE4AAM"){
        jobCardData = await getData({
          query: `select gst_number__c, customer__c, company__c, Name, createddate, sub_lead_type__c, sfid,
          (select Whatsapp_number__c from salesforce.contact where sfid like '%${sfid}%') ,
          (select firstName from salesforce.contact where sfid like '%${sfid}%') ,
          (select lastName from salesforce.contact where sfid like '%${sfid}%')
          from salesforce.job_card__c where customer__c like '%${sfid}%'`,
          token: data.token
        })
      }
      else {
        jobCardData = await getData({
          query: `select gst_number__c, lead__c, company__c, Name, createddate, sub_lead_type__c, sfid,
          (select Whatsapp_number__c from salesforce.lead where sfid like '%${sfid}%') ,
          (select firstName from salesforce.contact where sfid like '%${sfid}%') ,
          (select lastName from salesforce.contact where sfid like '%${sfid}%')
          from salesforce.job_card__c where lead__c like '%${sfid}%'`,
          token: data.token
        });
      }

      console.log("jobCardData =>", jobCardData)
      this.setState({ AllJobCards : jobCardData.result });

      let details;
      if(recordtypeid === "0121s0000000WE4AAM"){
        details = await getData({
          query: `SELECT * FROM salesforce.Contact 
          WHERE sfid LIKE '%${sfid}%' AND Recordtypeid = '0121s0000000WE4AAM'`,
          token: data.token,
        })
      }
      else{
        details = await getData({
          query: `SELECT * FROM salesforce.lead 
          WHERE sfid LIKE '%${sfid}%'`,
          token: data.token,
        })
      }
      console.log("details =>", details.result)
      this.setState({ detailsData: details.result[0]})
    }
    catch(e){
      console.log(e);
    }
  }

  handleJobCardDetails = (data) => {
    console.log("data:", data)
    this.props.history.push(`/job-card-details/${data.sfid}`)
  };

  tabData = () => [
    {
      tabName: "Details",
      component: (
        <Grid container>
          {this.state.detailsData && 
          <Grid item xs={12} md={12} lg={12}>
            <div className="card-container">
              <SubFormHeading>Customer Details</SubFormHeading>
              <Grid container>
                {" "}
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Name:</span>
                  {this.state.detailsData.name}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Mobile:</span>
                  {this.state.detailsData.whatsapp_number__c && ChangePhoneFormat(this.state.detailsData.whatsapp_number__c)}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Kit Enquiry:</span>
                  {this.state.detailsData.kit_enquiry__c}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Company:</span>
                  {this.state.detailsData.company__c || this.state.detailsData.company}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Email:</span>
                  {this.state.detailsData.email}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">WhatsApp No.:</span>
                  {this.state.detailsData.whatsapp_number__c}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Dealer Avg Rating:</span>
                  {this.state.detailsData.dealer_rating__c || this.state.detailsData.rating}
                </Grid>
              </Grid>
              <SubFormHeading>Address Details</SubFormHeading>
              <Grid container>
                {" "}
                <Grid item className="padding-6" xs={12} md={12} lg={12} sm={12}>
                  <span className="description-text">Address:</span>
                   {this.state.detailsData.mailingstreet || this.state.detailsData.street} {this.state.detailsData.mailingcity || this.state.detailsData.city} {this.state.detailsData.mailingpostalcode || this.state.detailsData.postalcode} {this.state.detailsData.mailingstate || this.state.detailsData.state}

                </Grid>
                {/* <Grid
                  item
                  className="padding-6"
                  xs={12}
                  md={12}
                  lg={12}
                  sm={12}
                >
                  <span className="description-text">Shipping Address:</span>
                  {this.state.detailsData.shippingstreet} {this.state.detailsData.shippingcity} {this.state.detailsData.shippingpostalcode} {this.state.detailsData.shippingstate}
                </Grid> */}
              </Grid>
              
            {isDealer() && (
              <div>
              <SubFormHeading>Vehicle Details</SubFormHeading>
              <Grid container>
                {" "}
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Vehicle Number:</span>
                  {this.state.detailsData.vehicle_no__c}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Fuel Type:</span>
                  {this.state.detailsData.fuel_type__c}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">3 or 4 Wheeler.:</span>
                  {this.state.detailsData.x3_or_4_wheeler__c}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Vehicle Make:</span>
                  {this.state.detailsData.vehicle_make__c}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Vehicle Model:</span>
                  {this.state.detailsData.vehicle_model__c}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Usage of Vehicle:</span>
                  {this.state.detailsData.usage_of_vehicle__c}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Engine Type:</span>
                  {this.state.detailsData.engine_type__c || this.state.detailsData.engine__c}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Daily Running KMs:</span>
                  {this.state.detailsData.daily_running_kms__c}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Registration Year:</span>
                  {this.state.detailsData.registration_year__c}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Year of Manufacturing:</span>
                  {this.state.detailsData.year_of_manufacturing__c}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Chassis Number:</span>
                  {this.state.detailsData.chassis_no__c}
                </Grid>
              </Grid>
              <SubFormHeading>Documents Required for RTO</SubFormHeading>
              <Grid container>
                {" "}
              </Grid>
              </div>
            )}
            </div>
          </Grid>
          } 
        </Grid>
      ),
    },
    {
      tabName: "Job Cards",
      component: (
        <Grid container>
          {this.state.AllJobCards && this.state.AllJobCards.map(jobCardData => {
          return (
            <Grid item xs={12} md={6}>
              <div className="card-container" >
                <Grid container >
                  <Grid className="padding-6-corners" item xs={6} md={6}>
                    <span className="description-text"> Jobcard No:</span>
                    {jobCardData.name}
                  </Grid>
                  <Grid className="padding-6-corners" item xs={6} md={6}>
                    <span className="description-text"> Date:</span>
                    {moment(jobCardData.createddate).format("DD/MM/YYYY")}
                  </Grid>
                </Grid>
                <Grid container >
                  <Grid className="padding-6-corners" item xs={6} md={6}>
                    <span className="description-text">Jobcard Type:</span>
                    {jobCardData.sub_lead_type__c}
                  </Grid>
                  <Grid className="padding-6-corners" item xs={6} md={6}> 
                  <span 
                    onClick={() => this.handleJobCardDetails(jobCardData)}
                    className="view">
                    View Details
                  </span>
                  </Grid>
                </Grid>
              </div>
            </Grid>
          )}
          )}
        </Grid>
      ),
    }
  ];

  render() {
    const { dealerDetails } = this.props;
    console.log("dealerDetails: ", dealerDetails)
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
export const CustomerLeadDetails = withRouter(
  connect<{}, {}, ICustomerDetailsProps>(mapStateToProps)(
    CustomerDetailsImpl
  ) as any
);