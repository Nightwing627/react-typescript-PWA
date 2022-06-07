import { Grid } from "@material-ui/core";
import { PersonPin, Phone } from "@material-ui/icons";
import * as React from "react";
import { connect } from "react-redux";
import AppBar from "src/navigation/App.Bar";
import data from "../../data";
import "./../Customers/customers.scss";
import { withRouter } from "react-router-dom";
import { IHistory } from "src/state/Utility";
import getData from "src/utils/getData";
import { getToken, isDealer } from "./../../state/Utility";
import { saveDealerData } from "src/actions/App.Actions";
import { ChangePhoneFormat } from "src/components/Format";
import moment from 'moment';

export interface IJobCardsProps {
  history: IHistory;
  location: any
}

export class JobCardsImpl extends React.PureComponent<IJobCardsProps, {allJobCards: any}> {
  constructor(props: IJobCardsProps) {
    super(props);
    this.state = {
      allJobCards : null
    }
  }

  async componentDidMount(){
    const { data } = getToken();
    const jobCardData = await this.getAllJobCards(data);
    this.setState({ allJobCards : jobCardData });
  }

  getAllJobCards = async (data) => {
    const {params} = this.props.match;
    console.log("param props: ", params);
    let sfid = "";
    let recordtypeid = "";
    if(params && params.recordtypeid && params.sfid){
      sfid = params.sfid;
      recordtypeid = params.recordtypeid;
    }
    try{
      let jobCardData;
      if(recordtypeid === '0122w000000cwfSAAQ'){
        jobCardData = await getData({
          query: `SELECT *
          FROM salesforce.contact Full OUTER JOIN salesforce.job_card__c
          ON salesforce.job_card__c.customer__c = salesforce.contact.sfid 
          WHERE salesforce.contact.assigned_dealer__c  LIKE '%${sfid}%' `,
          token: data.token
        })
      }

      console.log("jobCardData =>", jobCardData.result)
      return jobCardData.result;
    }
    catch(e){
      console.log(e);
    }
  }

  handleJobCardDetails = (data) => {
    this.props.history.push(`/job-card-details/${data.sfid}`)
  };

  public render() {
    return (
      <AppBar>
        <Grid container>
          {this.state.allJobCards && this.state.allJobCards.map(cust => {
          return (
            <Grid item xs={12} md={6}>
              <JobCardsList
                onClickDetails={this.handleJobCardDetails}
                jobCardData={cust}
              />
            </Grid>
          )}
          )}
        </Grid>
      </AppBar>
    );
  }
}
export function mapStateToProps() {
  return {};
}
export const JobCards = withRouter(
  connect<{}, {}, IJobCardsProps>(mapStateToProps)(JobCardsImpl as any) as any
);

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
      <Grid container >
        <Grid className="padding-6-corners" item xs={6} md={6}>
          <span className="description-text"> Dealer Name:</span>
          {jobCardData.dealername__c}
        </Grid>
        <Grid className="padding-6-corners" item xs={6} md={6}>
          <span className="description-text"> Dealer Code:</span>
          {jobCardData.dealer_code__c}
        </Grid>
      </Grid>
      <Grid container >
        <Grid className="padding-6-corners" item xs={6} md={6}>
          <span className="description-text"> Jobcard No:</span>
          {jobCardData.jcname__c}
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
        <span onClick={() => props.onClickDetails(jobCardData)} className="view">
          View Details
        </span>
        </Grid>
      </Grid>
    </div>
  )
};
