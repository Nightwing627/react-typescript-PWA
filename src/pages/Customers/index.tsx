import { Fab, Grid } from "@material-ui/core";
import { Add, PersonPin, Phone } from "@material-ui/icons";
import ChatIcon from "@material-ui/icons/Chat";
import MailIcon from "@material-ui/icons/Mail";
import PhoneIcon from "@material-ui/icons/Phone";
import WhatsappIcon from "./wtsapimg.png";
import Rating from "@material-ui/lab/Rating";
import * as React from "react";
import { connect } from "react-redux";
import AppBar from "src/navigation/App.Bar";
import data from "../../data";
import "./customers.scss";
import { withRouter } from "react-router-dom";
import filter from "./filter.svg";
import Search from "@material-ui/icons/Search";
import { IHistory } from "src/state/Utility";
import getData from "src/utils/getData";
import { getToken, isDealer } from "./../../state/Utility";
import { saveDealerData } from "src/actions/App.Actions";
import { ChangePhoneFormat } from "src/components/Format";

export interface ICustomersProps {
  history: IHistory;
  location: any
}

export class CustomersImpl extends React.PureComponent<ICustomersProps, {customers: any}> {
  constructor(props: ICustomersProps) {
    super(props);
    this.state = {
      customers : []
    }
  }

  async componentDidMount(){
    const { data } = getToken();
    const customerData = await this.getAllCustomers(data);
    this.setState({ customers : customerData });
  }

  getAllCustomers = async (data) => {
    const {location} = this.props;
    let sfid = data.sfid;
    let recordtypeid = data.record_type;
    if(location && location.data && Object.keys(location.data).length){
      data.sfid = location.data.sfid;
      recordtypeid = location.data.recordtypeid;
    }
    try{
      let customerData;
      if(recordtypeid === '0122w000000cwfSAAQ'){
        customerData = await getData({
          query: `SELECT name, whatsapp_number__c, email, purchased_product__c, lead_rating__c, recordtypeid, sfid  
          FROM salesforce.Contact 
          WHERE Assigned_Dealer__c LIKE '%${data.sfid}%' AND Recordtypeid = '0121s0000000WE4AAM'`,
          token: data.token
        })
      }
      else if(recordtypeid === "0122w000000cwfNAAQ"){
        customerData = await getData({
          query: `SELECT name, whatsapp_number__c, email, purchased_product__c, lead_rating__c, recordtypeid, sfid  
          FROM salesforce.Contact 
          WHERE contact.accountid LIKE '%${data.sfid}%' AND Recordtypeid = '0121s0000000WE4AAM'`,
          token: data.token
        });
      }

      console.log("customerData =>", customerData.result)
      return customerData.result;
    }
    catch(e){
      console.log(e);
    }
  }

  handleCustomerDetails = async (customer) => {
    console.log("customer Data ", customer)
    saveDealerData(customer);
    this.props.history.push(`/customer/customer-lead-details/${customer.recordtypeid}/${customer.sfid}`);
  };

  public render() {
    return (
      <AppBar>
        {/* {" "}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {" "}
          <Search fontSize="large" color="primary" />
          <img height="26px" src={filter} />
        </div> */}
        {/* <div className="cards-main customer-card"> */}
        <Grid container>
          {this.state.customers && this.state.customers.map(cust => {
          return (
            <Grid item xs={12} md={6}>
              <CustomerList
                onClickDetails={this.handleCustomerDetails}
                customerData={cust}
              />
            </Grid>
          )}
          )}
        </Grid>

        {/* </div> */}
      </AppBar>
    );
  }
}
export function mapStateToProps() {
  return {};
}
export const Customers = withRouter(
  connect<{}, {}, ICustomersProps>(mapStateToProps)(CustomersImpl as any) as any
);

const CustomerList = (props: any) => {
  const { customerData } = props;
  return (
    // <div className="cards-main">
    // {props.customerData.map((customerData: any, index: any) => {
    // return (
      <div className="card-container" >
        <Grid container >
          <Grid
            item
            className="padding-6-corners"
            xs={6}
            md={6}
          >
            <PersonPin /> <span style={{ padding: "5px" }} />
            <div style={{marginTop: '-25px', marginLeft: '25px'}}>
              {customerData.name}
            </div>
          </Grid>
          <Grid
            className="padding-6-corners"
            item
            xs={6}
            md={6}
          >
            <Phone /> <span style={{ padding: "5px" }} />
            <div style={{marginTop: '-25px', marginLeft: '25px'}}>
              {customerData.whatsapp_number__c && ChangePhoneFormat(customerData.whatsapp_number__c)}
            </div>
          </Grid>
        </Grid>
        <Grid container >
          {/* <Grid className="padding-6-corners" item xs={6} md={6}>
            <span className="description-text"> Email:</span>
            {customerData.email || 'NA'}
          </Grid> */}
          <Grid className="padding-6-corners" item xs={6} md={6}>
            <span className="description-text"> Purchased Product:</span>
            {customerData.purchased_product__c}
          </Grid>
          <Grid className="padding-6-corners" item xs={6} md={6}>
            <span className="description-text"> Dealer Rating:</span>
            {customerData.lead_rating__c}
          </Grid>
        </Grid>
        <Grid container >
          <Grid className="padding-6-corners" item xs={6} md={6}>
            <span className="description-text">Dealer Code:</span>
            {customerData.dealer_code__c}
            {/* <Rating
              readOnly
              precision={0.5}
              value={customerData.dealerRating}
            /> */}
          </Grid>
        </Grid>
        <Grid container >
          <Grid className="padding-6-corners" item xs={4} md={4}> 
          <span onClick={() => props.onClickDetails(customerData)} className="view">
            View Details
          </span>
          </Grid>
          <Grid className="padding-6-corners" item xs={8} md={8}>
            <div className="icon-container" style={{marginTop: '-8px'}}>
            <a href={"tel:" + customerData.whatsapp_number__c}>
              <PhoneIcon className="phone-icon" />
            </a>
            &nbsp;
            <a href={`sms:${customerData.whatsapp_number__c}?body=Text to Send.`}>
              <ChatIcon className="chat-icon" />
            </a>
            &nbsp;
            <a href={`mailto:${customerData.email}?subject=The subject of the mail&body=The Body of the mail`}>
              <MailIcon className="mail-icon" />
            </a>
            &nbsp;
            <a href={`https://api.whatsapp.com/send?phone=91${customerData.whatsapp_number__c}&text=example Leads`}>
              <img
                height="42px"
                src={WhatsappIcon}
              // src="https://img.icons8.com/color/48/000000/whatsapp.png"
              />{" "}
            </a>
            </div>
          </Grid>
        </Grid>
      </div>
  //    );
  // })} 
  // </div>
  )
};
