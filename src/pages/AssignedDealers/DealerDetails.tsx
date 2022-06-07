import * as React from "react";
import { connect } from "react-redux";
import AppBar from "src/navigation/App.Bar";
import { Grid, Button } from "@material-ui/core";
import { chartData } from "./usersData";
import "./asssignedDealers.scss";
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
import { ChangePhoneFormat } from "src/components/Format";
import { getToken, IHistory } from "src/state/Utility";
import getData from "src/utils/getData";
import { JobCardsList } from "src/pages/JobCard/index";

export interface IDealerDetailsProps {
  history: IHistory;
  location: any;
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

export class DealerDetailsImpl extends React.PureComponent<
  any,
  { users: any; isLoading: boolean; detailsData: any; customerData: any; }
> {
  constructor(props: IDealerDetailsProps) {
    super(props);
    this.state = { users: [], isLoading: false, detailsData: null, customerData: null };
  }

  componentWillMount() {
    console.log("this.props", this.props)
    if (isEmpty(this.props.dealerDetails)) {
      this.props.history.goBack();
    }
  }
 
  componentDidMount(){
    const { data } = getToken();
    console.log("DAta: ", data)
    this.getdetailsData(data);
  }

  getdetailsData = async (data) => {
    const {params} = this.props.match;
    console.log("paramas", params)
    let sfid = "";
    let recordtypeid = "";
    if(params && params.recordtypeid && params.sfid){
      sfid = params.sfid;
      recordtypeid = params.recordtypeid;
    }
    try{
      let details;
      if(recordtypeid === '0122w000000cwfSAAQ'){
        details = await getData({
          query: `SELECT * FROM salesforce.Account 
          WHERE sfid = '${sfid}' AND RecordTypeId = '0122w000000cwfSAAQ'`,
          token: data.token
        })
      }
      else if(recordtypeid === '0122w000000chRuAAI'){
        details = await getData({
          query: `SELECT * FROM salesforce.lead 
          WHERE sfid = '${sfid}' AND RecordTypeId = '0122w000000chRuAAI'`,
          token: data.token
        })
      }

      console.log("details =>", details.result)
      this.setState({ detailsData : details.result[0] });

      const customers = await getData({
        query: `SELECT Name, whatsapp_number__c FROM salesforce.contact WHERE Assigned_Dealer__c LIKE '${sfid}%'`,
        token: data.token
      })

      console.log("customers =>", customers);
      this.setState({ customerData: customers.result})

    }
    catch(e){
      console.log(e);
    }
  }

  tabDataforDealer = () => [
    {
      tabName: "Details",
      component: (
        <Grid container>
          {this.state.detailsData && 
          <Grid item xs={12} md={12} lg={12}>
            <div
              onClick={() =>
                this.props.dealerDetails.onClickItem(this.props.dealerDetails)
              }
              className="card-container"
            > 
              <SubFormHeading>Dealer Details</SubFormHeading>
              <Grid container>
                {" "}
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Name:</span>
                  {this.state.detailsData.name}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Account Name:</span>
                  {this.state.detailsData.name}
                </Grid>
                {/* <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Account Type:</span>
                  {this.state.detailsData.bank_account_type__c}
                </Grid> */}
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">WhatsApp No.:</span>
                  {this.state.detailsData.whatsapp_no__c}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Email:</span>
                  {this.state.detailsData.email__c}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Mobile:</span>
                  {this.state.detailsData.phone && ChangePhoneFormat(this.state.detailsData.phone)}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Dealer Avg Rating:</span>
                  {this.state.detailsData.rating}
                </Grid>
              </Grid>
              <SubFormHeading>Address Details</SubFormHeading>
              <Grid container>
                {" "}
                <Grid
                  item
                  className="padding-6"
                  xs={12}
                  md={12}
                  lg={12}
                  sm={12}
                >
                  <span className="description-text">Billing Address:</span>
                  {this.state.detailsData.billingstreet} {this.state.detailsData.billingcity} {this.state.detailsData.billingpostalcode} {this.state.detailsData.billingstate}
                </Grid>
                <Grid
                  item
                  className="padding-6"
                  xs={12}
                  md={12}
                  lg={12}
                  sm={12}
                >
                  <span className="description-text">Shipping Address:</span>
                  {this.state.detailsData.shippingstreet} {this.state.detailsData.shippingcity} {this.state.detailsData.shippingpostalcode} {this.state.detailsData.shippingstate}
                </Grid>
              </Grid>
              <SubFormHeading>Bank and KYC Details</SubFormHeading>
              <Grid container>
                <Grid
                  item
                  className="padding-6"
                  xs={12}
                  md={12}
                  lg={12}
                  sm={12}
                >
                  <b>GST Number - {this.state.detailsData.gst_number__c}</b>
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Bank Name:</span>
                  {this.state.detailsData.bank_name__c}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">IFSC:</span>
                  {this.state.detailsData.bank_ifsc_code__c}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Account Number:</span>
                  {this.state.detailsData.bank_account_number__c}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Account Type:</span>
                  {this.state.detailsData.bank_account_type__c}
                </Grid>
              </Grid>
              <SubFormHeading>Related Customers</SubFormHeading>{" "}
              <Grid container>
                {this.state.customerData && this.state.customerData.map((x) => {
                  return (
                    <React.Fragment>
                      <Grid
                        item
                        className="padding-6"
                        xs={12}
                        md={6}
                        lg={6}
                        sm={6}
                      >
                        <span className="description-text">Name -</span>
                        {x.name}
                      </Grid>
                      <Grid
                        item
                        className="padding-6"
                        xs={12}
                        md={6}
                        lg={6}
                        sm={6}
                      >
                        <span className="description-text">Mob No. -</span>
                        {x.whatsapp_number__c && ChangePhoneFormat(x.whatsapp_number__c)}
                      </Grid>
                    </React.Fragment>
                  );
                })}
              </Grid>
            </div>
          </Grid>
          }
        </Grid>
      ),
    },
    {
      tabName: "Report",
      component: (
        <div className="margin-10">
          <div className="margin-10">
            <TableWithGrid
              title={"Sale Target 3 wheeler"}
              data={data.sales.data}
              columns={columns}
              options={options as any}
            />{" "}
          </div>
          <div className="margin-10">
            <TableWithGrid
              title={"Sale Target 4 wheeler"}
              data={data.sales.data}
              columns={columns}
              options={options as any}
            />
          </div>
          <div className="card-container">
            <SubFormHeading>Product wise sale</SubFormHeading>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart width={730} height={250} data={chartData}>
                <CartesianGrid />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="uv" fill="#82ca9d" barSize ={100} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="button-container">
            <Button
              onClick={() => this.props.history.push({pathname:"/leads", data: this.state.detailsData})}
              variant="contained"
              color="primary"
              type="submit"
            >
              View Leads
            </Button>
            <span style={{ padding: "4px" }} />
            <Button
              onClick={() => this.props.history.push({pathname: "/inventory", data: this.state.detailsData})}
              variant="contained"
              color="primary"
              type="submit"
            >
              View Inventory
            </Button>{" "}
            <span style={{ padding: "4px" }} />
            <Button
              onClick={() => this.props.history.push({pathname:"/customers", data: this.state.detailsData})}
              variant="contained"
              color="primary"
              type="submit"
            >
              View Customers
            </Button>
            <span style={{ padding: "4px" }} />
            <Button
              onClick={() => this.props.history.push({pathname:`/job-cards/${this.state.detailsData.recordtypeid}/${this.state.detailsData.sfid}`})}
              variant="contained"
              color="primary"
              type="submit"
            >
              View JobCards
            </Button>
          </div>
        </div>
      ),
    }
  ];

  tabDataforLead = () => [
    {
      tabName: "Details",
      component: (
        <Grid container>
          {this.state.detailsData.name && 
          <Grid item xs={12} md={12} lg={12}>
            <div className="card-container"> 
              <SubFormHeading>Dealer Details</SubFormHeading>
              <Grid container>
                {" "}
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Name:</span>
                  {this.state.detailsData.name}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Account Name:</span>
                  {this.state.detailsData.name}
                </Grid>
                {/* <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Account Type:</span>
                  {this.state.detailsData.bank_account_type__c}
                </Grid> */}
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">WhatsApp No.:</span>
                  {this.state.detailsData.whatsapp_no__c}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Email:</span>
                  {this.state.detailsData.email__c}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Mobile:</span>
                  {this.state.detailsData.phone && ChangePhoneFormat(this.state.detailsData.phone)}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Dealer Avg Rating:</span>
                  {this.state.detailsData.rating}
                </Grid>
              </Grid>
              <SubFormHeading>Address Details</SubFormHeading>
              <Grid container>
                {" "}
                <Grid
                  item
                  className="padding-6"
                  xs={12}
                  md={12}
                  lg={12}
                  sm={12}
                >
                  <span className="description-text">Billing Address:</span>
                  {this.state.detailsData.billingstreet} {this.state.detailsData.billingcity} {this.state.detailsData.billingpostalcode} {this.state.detailsData.billingstate}
                </Grid>
                <Grid
                  item
                  className="padding-6"
                  xs={12}
                  md={12}
                  lg={12}
                  sm={12}
                >
                  <span className="description-text">Shipping Address:</span>
                  {this.state.detailsData.shippingstreet} {this.state.detailsData.shippingcity} {this.state.detailsData.shippingpostalcode} {this.state.detailsData.shippingstate}
                </Grid>
              </Grid>
              <SubFormHeading>Bank and KYC Details</SubFormHeading>
              <Grid container>
                <Grid
                  item
                  className="padding-6"
                  xs={12}
                  md={12}
                  lg={12}
                  sm={12}
                >
                  <b>GST Number - {this.state.detailsData.gst_number__c}</b>
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Bank Name:</span>
                  {this.state.detailsData.bank_name__c}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">IFSC:</span>
                  {this.state.detailsData.bank_ifsc_code__c}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Account Number:</span>
                  {this.state.detailsData.bank_account_number__c}
                </Grid>
                <Grid item className="padding-6" xs={12} md={6} lg={6} sm={6}>
                  <span className="description-text">Account Type:</span>
                  {this.state.detailsData.bank_account_type__c}
                </Grid>
              </Grid>
              <SubFormHeading>Related Customers</SubFormHeading>{" "}
              <Grid container>
                {this.props.dealerDetails.customers.map((x) => {
                  return (
                    <React.Fragment>
                      <Grid
                        item
                        className="padding-6"
                        xs={12}
                        md={6}
                        lg={6}
                        sm={6}
                      >
                        <span className="description-text">Name -</span>
                        {x.name}
                      </Grid>
                      <Grid
                        item
                        className="padding-6"
                        xs={12}
                        md={6}
                        lg={6}
                        sm={6}
                      >
                        <span className="description-text">Mob No. -</span>
                        {x.phone && ChangePhoneFormat(x.phone)}
                      </Grid>
                    </React.Fragment>
                  );
                })}
              </Grid>
            </div>
          </Grid>
          }
        </Grid>
      ),
    },
  ];

  render() {
    console.log("detailsData: ", this.state.detailsData)
    return (
      <AppBar>
        {/* <div style={{ padding: "20px" }}> */}
          <Tabs tabsData={this.state.detailsData && this.state.detailsData.recordtypeid === "0122w000000chRuAAI" ? this.tabDataforLead() :this.tabDataforDealer()} />
        {/* </div> */}
      </AppBar>
    );
  }
}
export function mapStateToProps(state) {
  return { dealerDetails: state.users.get("data") };
}
export const DealerDetails = withRouter(
  connect<{}, {}, IDealerDetailsProps>(mapStateToProps)(
    DealerDetailsImpl
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
