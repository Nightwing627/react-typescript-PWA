import { Button, Fab, Grid, TextField } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import { Add, PersonPin, Phone } from "@material-ui/icons";
import Rating from "@material-ui/lab/Rating";
import EditIcon from '@material-ui/icons/Edit';
import ChatIcon from "@material-ui/icons/Chat";
import MailIcon from "@material-ui/icons/Mail";
import PhoneIcon from "@material-ui/icons/Phone";
import WhatsappIcon from "./wtsapimg.png";
import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { BaseModal } from "src/components/BaseModal";
import { Tabs } from "src/components/Tabs";
import AppBar from "src/navigation/App.Bar";
import getData from "src/utils/getData";
import data from "../../data";
import { getToken, isDealer, IHistory, changeValuesInStore } from "src/state/Utility";
import { saveLeadsData, saveAssignedDealersData, saveDealerData } from "src/actions/App.Actions";
import { ChangePhoneFormat } from "src/components/Format";
import "./leads.scss";
import { Console } from "console";
import Select from 'react-select';

var loggedInUserDetails;
const allfilterOptions = (leadsData) => [
  {
    value: "all",
    label: "All (" + leadsData.length + " )",
  },
  {
    value: "fresh",
    label: "Fresh (" + leadsData.length + " )",
  },
  {
    value: "followups",
    label: "Followups (" + leadsData.length + " )",
  },
  {
    value: "followups td",
    label: "Followups Today (" + leadsData.length + " )",
  },
  {
    value: "followups",
    label: "Followups Pending (" + leadsData.length + " )",
  },
];

const leadfilterOptions = (leadsData) => [
  {
    value: "3 Wheeler",
    label: "3 Wheeler ( "+ leadsData.filter( lead =>  lead.x3_or_4_wheeler__c === "3 Wheeler" ).length +" )",
  },
  {
    value: "4 Wheeler",
    label: "4 Wheeler ( "+ leadsData.filter( lead =>  lead.x3_or_4_wheeler__c === "4 Wheeler" ).length +" )",
  },
];

const subfilterOptions = (leadsData) => [
  {
    value: "Customer",
    label: "Customer ( "+ leadsData.filter( lead =>  lead.sub_lead_type__c === "Customer" ).length +" )",
  },
  {
    value: "Influencer",
    label: "Influencer ( "+ leadsData.filter( lead =>  lead.sub_lead_type__c === "Influencer" ).length +" )",
  },
  {
    value: "Fitment",
    label: "Fitment ( "+ leadsData.filter( lead =>  lead.sub_lead_type__c === "Fitment" ).length +" )",
  },
  {
    value: "Servicing",
    label: "Servicing ( "+ leadsData.filter( lead =>  lead.sub_lead_type__c === "Servicing" ).length +" )",
  },
];

const ratingfilterOptions = (leadsData) => [
  {
    value: "Hot",
    label: "Hot ( "+ leadsData.filter( lead =>  lead.rating === "Hot" ).length +" )",
  },
  {
    value: "Cold",
    label: "Cold ( "+ leadsData.filter( lead =>  lead.rating === "Cold" ).length +" )",
  },
  {
    value: "Warm",
    label: "Warm ( "+ leadsData.filter( lead =>  lead.rating === "Warm" ).length +" )",
  },
];

export interface ILeadsProps {
  location:any;
  history: IHistory;
  isDealer: boolean;
  leadsData: any;
  dealersData: any;
  openSMSForm: any;
}

export class LeadsImpl extends React.Component<
  ILeadsProps,
  {
    topActiveTab: string;
    activeTabType: string;
    isModalOpen: boolean;
    dealers: any;
    showFilerOptions: boolean;
    selectedFilter: string;
    selectedDealerAssignTo: string;
    selectedCustomerToAssign: string;
    selectedFilterValues: any;
    filterType: string;
    sortType: string;
    showStatsModal: boolean;
    phoneNumber: number;
  }
  > {
  public state = {
    topActiveTab: "Customer",
    activeTabType: "Assigned",
    isModalOpen: false,
    showFilerOptions: false,
    selectedFilter: "",
    selectedDealerAssignTo: "",
    selectedCustomerToAssign: "",
    selectedFilterValues: [],
    dealers: data.leads.data,
    filterType: "",
    sortType: "",
    showStatsModal: false,
    phoneNumber: 0,
  };

  async componentDidMount() {
    loggedInUserDetails = getToken().data;
    this.getAllLeadsData(loggedInUserDetails.token, loggedInUserDetails.sfid, loggedInUserDetails.record_type);
    this.getAllAssignedDealers(loggedInUserDetails);
  }

  getAllLeadsData = async (token, oldSfid, oldRecordtypeid) => {
    const {location} = this.props;
    let sfid = oldSfid
    let recordtypeid = oldRecordtypeid
    if(location && location.data && Object.keys(location.data).length){
      sfid = location.data.sfid;
      recordtypeid = location.data.recordtypeid;
    }
    
    console.log("token: ", token);
    console.log("sfid: ", sfid);
    console.log("recordtypeid: ", recordtypeid);
    let leadsData;
    try {
      if (recordtypeid === "0122w000000cwfSAAQ") {
        leadsData = await getData({
          query: `SELECT id, recordtypeid, createddate, assigned_dealer__c, email, name, firstname, lastname, whatsapp_number__c, kit_enquiry__c, x3_or_4_wheeler__c, dealer_generated__c, rating, city, sfid 
          FROM salesforce.Lead 
          WHERE RecordTypeId = '0122w000000chRpAAI' 
          AND (Assigned_Dealer__c LIKE '%${sfid}%') 
          AND sfid is not null AND Status != 'Closed'`,
          token: token
        })
      } else if (recordtypeid === "0122w000000cwfNAAQ") {
        console.log("here");
        leadsData = await getData({
          query: `SELECT id, recordtypeid, createddate, assigned_dealer__c, email, name, firstname, lastname, whatsapp_number__c, kit_enquiry__c, x3_or_4_wheeler__c, dealer_generated__c, rating, city, sfid
          FROM salesforce.Lead 
          WHERE (Assigned_Distributor__c LIKE '%${sfid}%') 
          AND sfid is not null`,
          token: token
        })
      }
      console.log("leadsData =>", leadsData);
      // return leadsData.result;
      saveLeadsData(leadsData.result)

    } catch (e) {
      console.log('fetch Inventory Error', e)
    }
  }

  getAllAssignedDealers = async (data) => {
    console.log("data: ", data);
    try {
      const assignedDealerData = await getData({
        query: `SELECT * FROM salesforce.Account 
        WHERE Assigned_Distributor__c = '${data.sfid}' AND RecordTypeId = '0122w000000cwfSAAQ'`,
        token: data.token
      })

      console.log("assignedDealerData =>", assignedDealerData);
      saveAssignedDealersData(assignedDealerData.result);

    } catch (e) {
      console.log('fetch Inventory Error', e)
    }
  }

  getAllCustomersAssignedToDelaer = async (token, sfid) => {
    console.log("token: ", token);
    console.log("sfid: ", sfid)
    try {
      const customerData = await getData({
        query: `SELECT Name, Phone
          FROM salesforce.Contact 
          WHERE Assigned_Dealer__c LIKE '${sfid}%'`,
        token: token
      })

      console.log("customerData =>", customerData);
      return customerData.result;

    } catch (e) {
      console.log('fetch Inventory Error', e)
    }
  }

  assignCustomerLeadToDealer = async (data, custSFID, dealerSFID) => {
    console.log("custSFID: ", custSFID);
    console.log("dealerSFID: ", dealerSFID);
    try {
      const updateCustLeadAssigned = await getData({
        query: `UPDATE salesforce.Lead
          SET Assigned_dealer__c = '${dealerSFID}'
          WHERE sfid LIKE '%${custSFID}%'`,
        token: data.token
      })

      console.log("updateCustLeadAssigned =>", updateCustLeadAssigned);
      return updateCustLeadAssigned.result;

    } catch (e) {
      console.log('fetch Inventory Error', e)
    }
  }

  public openAssignDealerModal = (custSFID) => {
    console.log(custSFID)
    this.setState({ isModalOpen: true });
    this.setState({ selectedCustomerToAssign: custSFID });
  };

  public renderCustomersAssigned = (leadsData) => {
    return (
      <Grid container>
        {console.log("DEtails: ", this.props.leadsData)}
        {leadsData && leadsData.map((d) => {
          // console.log("DEtails: ", d)
          // if (!d.isDealer && d.assigned) {
          if (d.recordtypeid === '0122w000000chRpAAI' && d.assigned_dealer__c) {
            return (
              <Grid item xs={12} md={6}>
                <CardDetails 
                  smsClick={this.handlesmsClick} 
                  details={d} 
                  onClickDetails={this.handleCustomerDetails} 
                  AssignedDealers={this.props.dealersData} 
                  history={this.props.history} 
                />
              </Grid>
            );
          }
        })}
      </Grid>
    );
  };

  public renderCustomersUnAssigned = (leadsData) => {
    return (
      <Grid container>
        {leadsData && leadsData.map((d) => {
          // if (!d.isDealer && !d.assigned) {
          if (d.recordtypeid === '0122w000000chRpAAI' && !d.assigned_dealer__c) {
            return (
              <Grid item xs={12} md={6}>
                <CardDetails 
                  smsClick={this.handlesmsClick} 
                  details={d} 
                  onClickDetails={this.handleCustomerDetails} 
                  onClickAssign={this.openAssignDealerModal} 
                  history={this.props.history} 
                />
              </Grid>
            );
          }
          return " ";
        })}
      </Grid>
    );
  };

  public renderDealersAssigned = (leadsData) => {
    return (
      <Grid container>
        {leadsData && leadsData.map((d) => {
          if (d.recordtypeid === '0122w000000chRuAAI') {
            return (
              <Grid item xs={12} md={6}>
                <CardDetailsForDealer 
                  smsClick={this.handlesmsClick} 
                  details={d} 
                  onClickDetails={this.handleClickDealerDetails} 
                  history={this.props.history} 
                />
              </Grid>
            );
          }
        })}
      </Grid>
    );

    // const AssignedDealer = data.leads.data.map((d) => {
    //   if (d.isDealer && d.assigned)
    //     return d;
    // });
    // return (
    //   <Grid container >
    //     <CardDetails details={AssignedDealer} history={this.props.history} />
    //   </Grid>
    // );
  };

  public renderDealersUnAssigned = () => {
    return (
      <Grid container>
        {data.leads.data.map((d) => {
          if (d.isDealer && !d.assigned) {
            return (
              <Grid item xs={12} md={6}>
                <CardDetails 
                  smsClick={this.handlesmsClick} 
                  details={d} 
                  history={this.props.history} 
                />
              </Grid>
            );
          }
          return " ";
        })}
      </Grid>
    );

    // const  UnassignedDealer = data.leads.data.map((d) => {
    //   if (d.isDealer && !d.assigned)
    //     return d;
    // })
    // return (
    //   <Grid container >
    //     <CardDetails details={UnassignedDealer} history={this.props.history} />
    //   </Grid>
    // );
  };

  public tabData = (leadsData) => [
    {
      tabName: "Customer",
      component: "",
      onTabSelect: (tabName: any) => { this.setState({ topActiveTab: tabName }) },
    },
    {
      tabName: "Dealer",
      component: this.renderDealersAssigned(leadsData),
      onTabSelect: (tabName: any) => { this.getAllAssignedDealers(loggedInUserDetails), this.setState({ topActiveTab: tabName }) },
    },
  ];

  public tabDataToDisplay = (leadsData) => [
    {
      tabName: "Assigned",
      component:
        this.state.topActiveTab === "Customer"
          ? this.renderCustomersAssigned(leadsData)
          : this.renderDealersAssigned(leadsData),
      onTabSelect: (tabName: any) => { this.getAllLeadsData(loggedInUserDetails.token, loggedInUserDetails.sfid, loggedInUserDetails.record_type), this.setState({ activeTabType: tabName }) },
    },
    {
      tabName: "Unassigned",
      component:
        this.state.topActiveTab === "Customer"
          ? this.renderCustomersUnAssigned(leadsData)
          : this.renderDealersUnAssigned(),
      onTabSelect: (tabName: any) => { this.getAllLeadsData(loggedInUserDetails.token, loggedInUserDetails.sfid, loggedInUserDetails.record_type), this.setState({ activeTabType: tabName }) },
    },
  ];

  public filterDealers = (event: any) => {
    const value = event.target.value;
    const dealers = data.dealers.filter((dData) =>
      dData.name.toLowerCase().includes(value.toLowerCase())
    );
    this.setState({
      dealers,
    });
  };

  public renderAssignDealerModal = () => {
    return (
      <BaseModal
        className="assign-dealer-modal"
        contentClassName="support-content"
        onClose={() => this.setState({ isModalOpen: false })}
        open={this.state.isModalOpen}
      >
        <div className="head-title">Assign Dealer</div>
        <form className="form-content" autoComplete="off">
          {/* <TextField
            id="outlined-basic"
            label="Search Dealer"
            className="form-input"
            onChange={this.filterDealers}
            variant="outlined"
          /> */}
          <div className="dealer-name-container">
            {this.props.dealersData
              ? this.props.dealersData.map((dealerData) => (
                <div
                  onClick={() =>
                    this.setState({
                      selectedDealerAssignTo: dealerData.sfid
                    })
                  }
                  className={`dealer-name ${
                    this.state.selectedDealerAssignTo === dealerData.sfid && "active"
                    }`}
                >{dealerData.name}</div>
              ))
              : "No Dealer Found"}
          </div>
          <div className="button-container">
            <Button
              onClick={() => this.setState({ isModalOpen: false })}
              variant="contained"
              color="default"
            >
              Cancel
            </Button>{" "}
            <Button
              onClick={() => {
                this.assignCustomerLeadToDealer(loggedInUserDetails, this.state.selectedCustomerToAssign, this.state.selectedDealerAssignTo),
                  this.getAllLeadsData(loggedInUserDetails.token, loggedInUserDetails.sfid, loggedInUserDetails.record_type);
                this.setState({ isModalOpen: false })
              }}
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </div>
        </form>
      </BaseModal>
    );
  };

  public renderFilterModal = () => {
    return (
      <BaseModal
        className="assign-dealer-modal"
        onClose={() => this.setState({ showFilerOptions: false })}
        contentClassName="support-content"
        open={this.state.showFilerOptions}
      >
        <div className="head-title">Filters</div>
        <form className="form-content" autoComplete="off">
          <div className="dealer-name-container">
            {this.state.filterType === "All" ?
              allfilterOptions.map((fData, index) => (
                <div
                  key={index}
                  onClick={() =>
                    this.setState({
                      selectedFilter: fData.label,
                    })
                  }
                  className={`dealer-name ${
                    this.state.selectedFilter === fData.label && "active"
                    }`}
                >
                  {fData.label}
                </div>
              ))
              : null}
            {this.state.filterType === "Lead Type" ?
              leadfilterOptions.map((fData, index) => (
                <div
                  key={index}
                  onClick={() =>
                    this.setState({
                      selectedFilter: fData.label,
                    })
                  }
                  className={`dealer-name ${
                    this.state.selectedFilter === fData.label && "active"
                    }`}
                >
                  {fData.label}
                </div>
              ))
              : null}
            {this.state.filterType === "Sub Lead Type" ?
              subfilterOptions.map((fData, index) => (
                <div
                  key={index}
                  onClick={() =>
                    this.setState({
                      selectedFilter: fData.label,
                    })
                  }
                  className={`dealer-name ${
                    this.state.selectedFilter === fData.label && "active"
                    }`}
                >
                  {fData.label}
                </div>
              ))
              : null}
            {this.state.filterType === "Rating" ?
              ratingfilterOptions.map((fData, index) => (
                <div
                  key={index}
                  onClick={() =>
                    this.setState({
                      selectedFilter: fData.label,
                    })
                  }
                  className={`dealer-name ${
                    this.state.selectedFilter === fData.label && "active"
                    }`}
                >
                  {fData.label}
                </div>
              ))
              : null}
          </div>
          <div className="button-container">
            <Button
              onClick={() => this.setState({ showFilerOptions: false })}
              variant="contained"
              color="default"
            >
              Cancel
            </Button>{" "}
            <Button
              onClick={() => this.setState({ showFilerOptions: false })}
              variant="contained"
              color="primary"
            >
              Apply
            </Button>
          </div>
        </form>
      </BaseModal>
    );
  };

  handlesmsClick = (phone) => { 
    console.log("Phone", phone)
    changeValuesInStore("openSMSForm", {})
    this.setState({ showStatsModal: true }), 
    this.setState({ phoneNumber: phone}) 
  };

  tabDataForDealer = (leadsData) => [
    {
      tabName: "All ( "+ ( leadsData.length ) +" )",
      options: allfilterOptions(leadsData),
      component: (
        <Grid container>
          {leadsData && leadsData.map((d) => {
            return (
              <Grid item xs={12} md={6} >
                <CardDetailsForDealer
                  smsClick={this.handlesmsClick} 
                  onClickDetails={this.handleCustomerDetails}
                  details={d} history={this.props.history} />
              </Grid>
            );
          })}
        </Grid>
      ),
      onTabSelect: (tabName) => this.setState({ showFilerOptions: true, filterType: "All" }),
      onChangeTabValue: (tabValue) => {
        const arr = this.state.selectedFilterValues.filter((item) => item.label === "all" ? item.value = tabValue : null)
        if (arr.length === 0) {
          this.state.selectedFilterValues.push({ label: "all", value: tabValue })
        }
      }
    },
    {
      tabName: "Lead Type",
      options: leadfilterOptions(leadsData),
      component: (
        <Grid container>
          {leadsData && leadsData.map((d) => {
            const filterLead = this.state.selectedFilterValues.find(item => item.label === "leadType")
            const filterSub = this.state.selectedFilterValues.find(item => item.label === "subLeadType")
            const filterRating = this.state.selectedFilterValues.find(item => item.label === "rating")

            if (filterSub && filterSub.value && filterRating && filterRating.value) {
              if ((filterLead && filterLead.value === d.x3_or_4_wheeler__c) &&
                  (filterSub && filterSub.value === d.sub_lead_type__c) && 
                  (filterRating && filterRating.value === d.rating)) {
                return (
                  <Grid item xs={12} md={6} >
                    {console.log("d: ", d)}
                    <CardDetailsForDealer
                      smsClick={this.handlesmsClick} 
                      onClickDetails={this.handleCustomerDetails}
                      details={d} history={this.props.history} />
                  </Grid>
                );
              }
            }
            else if(filterSub && filterSub.value){
              if ((filterLead && filterLead.value === d.x3_or_4_wheeler__c) &&
                  (filterSub && filterSub.value === d.sub_lead_type__c)) {
                return (
                  <Grid item xs={12} md={6} >
                    <CardDetailsForDealer
                      smsClick={this.handlesmsClick} 
                      onClickDetails={this.handleCustomerDetails}
                      details={d} history={this.props.history} />
                  </Grid>
                );
              }
            }
            else if(filterRating && filterRating.value){
              if ((filterLead && filterLead.value === d.x3_or_4_wheeler__c) &&
                  (filterRating && filterRating.value === d.rating)) {
                return (
                  <Grid item xs={12} md={6} >
                    <CardDetailsForDealer
                      smsClick={this.handlesmsClick} 
                      onClickDetails={this.handleCustomerDetails}
                      details={d} history={this.props.history} />
                  </Grid>
                );
              }
            }
            else{
              if ((filterLead && filterLead.value === d.x3_or_4_wheeler__c)) {
                return (
                  <Grid item xs={12} md={6} >
                    <CardDetailsForDealer
                      smsClick={this.handlesmsClick} 
                      onClickDetails={this.handleCustomerDetails}
                      details={d} history={this.props.history} />
                  </Grid>
                );
              }
            }
          })}
        </Grid>
      ),
      onTabSelect: (tabName) => this.setState({ showFilerOptions: true, filterType: "Lead Type" }),
      onChangeTabValue: (tabValue) => {
        const arr = this.state.selectedFilterValues.filter((item) => item.label === "leadType" ? item.value = tabValue : null)
        if (arr.length === 0) {
          this.state.selectedFilterValues.push({ label: "leadType", value: tabValue })
        }
      }
    },
    {
      tabName: "Sub Lead Type",
      options: subfilterOptions(leadsData),
      component: (
        <Grid container>
          {leadsData && leadsData.map((d) => {
            const filterLead = this.state.selectedFilterValues.find(item => item.label === "leadType")
            const filterSub = this.state.selectedFilterValues.find(item => item.label === "subLeadType")
            const filterRating = this.state.selectedFilterValues.find(item => item.label === "rating")

            if (filterLead && filterLead.value && filterRating && filterRating.value) {
              if ((filterSub && filterSub.value === d.sub_lead_type__c) && 
                  (filterLead && filterLead.value === d.x3_or_4_wheeler__c) &&
                  (filterRating && filterRating.value === d.rating)) {
                return (
                  <Grid item xs={12} md={6} >
                    {console.log("d: ", d)}
                    <CardDetailsForDealer
                      smsClick={this.handlesmsClick} 
                      onClickDetails={this.handleCustomerDetails}
                      details={d} history={this.props.history} />
                  </Grid>
                );
              }
            }
            else if(filterLead && filterLead.value){
              if ((filterSub && filterSub.value === d.sub_lead_type__c) && 
                  (filterLead && filterLead.value === d.x3_or_4_wheeler__c)) {
                return (
                  <Grid item xs={12} md={6} >
                    <CardDetailsForDealer
                      smsClick={this.handlesmsClick} 
                      onClickDetails={this.handleCustomerDetails}
                      details={d} history={this.props.history} />
                  </Grid>
                );
              }
            }
            else if(filterRating && filterRating.value){
              if ((filterSub && filterSub.value === d.sub_lead_type__c) &&
                  (filterRating && filterRating.value === d.rating)) {
                return (
                  <Grid item xs={12} md={6} >
                    <CardDetailsForDealer
                      smsClick={this.handlesmsClick} 
                      onClickDetails={this.handleCustomerDetails}
                      details={d} history={this.props.history} />
                  </Grid>
                );
              }
            }
            else{
              if ((filterSub && filterSub.value === d.sub_lead_type__c)) {
                return (
                  <Grid item xs={12} md={6} >
                    <CardDetailsForDealer
                      smsClick={this.handlesmsClick} 
                      onClickDetails={this.handleCustomerDetails}
                      details={d} history={this.props.history} />
                  </Grid>
                );
              }
            }
          })}
        </Grid>
      ),
      onTabSelect: (tabName) => this.setState({ showFilerOptions: true, filterType: "Sub Lead Type" }),
      onChangeTabValue: (tabValue) => {
        const arr = this.state.selectedFilterValues.filter((item) => item.label === "subLeadType" ? item.value = tabValue : null)
        if (arr.length === 0) {
          this.state.selectedFilterValues.push({ label: "subLeadType", value: tabValue })
        }
      }
    },
    {
      tabName: "Rating",
      options: ratingfilterOptions(leadsData),
      component: (
        <Grid container>
          {leadsData && leadsData.map((d) => {
            const filterLead = this.state.selectedFilterValues.find(item => item.label === "leadType")
            const filterSub = this.state.selectedFilterValues.find(item => item.label === "subLeadType")
            const filterRating = this.state.selectedFilterValues.find(item => item.label === "rating")

            if (filterLead && filterLead.value && filterSub && filterSub.value) {
              if ((filterRating && filterRating.value === d.rating) &&
                  (filterSub && filterSub.value === d.sub_lead_type__c) && 
                  (filterLead && filterLead.value === d.x3_or_4_wheeler__c)) {
                return (
                  <Grid item xs={12} md={6} >
                    {console.log("d: ", d)}
                    <CardDetailsForDealer
                      smsClick={this.handlesmsClick} 
                      onClickDetails={this.handleCustomerDetails}
                      details={d} history={this.props.history} />
                  </Grid>
                );
              }
            }
            else if(filterSub && filterSub.value){
              if ((filterRating && filterRating.value === d.rating) &&
                  (filterSub && filterSub.value === d.sub_lead_type__c)) {
                return (
                  <Grid item xs={12} md={6} >
                    <CardDetailsForDealer
                      smsClick={this.handlesmsClick} 
                      onClickDetails={this.handleCustomerDetails}
                      details={d} history={this.props.history} />
                  </Grid>
                );
              }
            }
            else if(filterLead && filterLead.value){
              if ((filterRating && filterRating.value === d.rating) &&
                  (filterLead && filterLead.value === d.x3_or_4_wheeler__c)) {
                return (
                  <Grid item xs={12} md={6} >
                    <CardDetailsForDealer
                      smsClick={this.handlesmsClick} 
                      onClickDetails={this.handleCustomerDetails}
                      details={d} history={this.props.history} />
                  </Grid>
                );
              }
            }
            else{
              if (-(filterRating && filterRating.value === d.rating)) {
                return (
                  <Grid item xs={12} md={6} >
                    <CardDetailsForDealer
                      smsClick={this.handlesmsClick} 
                      onClickDetails={this.handleCustomerDetails}
                      details={d} history={this.props.history} />
                  </Grid>
                );
              }
            }
          })}
        </Grid>
      ),
      onTabSelect: (tabName) => this.setState({ showFilerOptions: true, filterType: "Rating" }),
      onChangeTabValue: (tabValue) => {
        const arr = this.state.selectedFilterValues.filter((item) => item.label === "rating" ? item.value = tabValue : null)
        if (arr.length === 0) {
          this.state.selectedFilterValues.push({ label: "rating", value: tabValue })
        }
      }
    },
    {
      tabName: "Walk Ins ("+ leadsData.filter( lead =>  lead.leadsource === "Store Visits" ).length +")",
      options: [],
      component: (
        <Grid container>
          {leadsData && leadsData.map((d) => {
            if (d.leadsource === "Store Visits") {
              return (
                <Grid item xs={12} md={6} >
                  <CardDetailsForDealer
                    smsClick={this.handlesmsClick} 
                    onClickDetails={this.handleCustomerDetails}
                    details={d} history={this.props.history} />
                </Grid>
              );
            }
          })}
        </Grid>
      ),
    },
  ];

  handleClickDealerDetails = async (dealer) => {
    console.log("dealer Data ", dealer)
    const customers = await this.getAllCustomersAssignedToDelaer(loggedInUserDetails.token, dealer.sfid);
    console.log("customer Data ", customers)
    saveDealerData({ dealer, customers });
    this.props.history.push(`/dealers/dealer-details/${dealer.recordtypeid}/${dealer.sfid}`);
  };

  handleCustomerDetails = async (customer) => {
    console.log("customer Data ", customer)
    saveDealerData(customer);
    this.props.history.push(`/customer/customer-lead-details/${customer.recordtypeid}/${customer.sfid}`);
  };

  handleChange = (key, value) => {
    changeValuesInStore(`openSMSForm.${key}`, value);
  };

  public openSMSModel = () => {
    const phoneNumber = this.state.phoneNumber;
    console.log("phoneNumber", phoneNumber)
    return(
      <BaseModal
        className="assign-dealer-modal"
        onClose={() => this.setState({ showStatsModal: false })}
        contentClassName="support-content"
        open={this.state.showStatsModal}
      >
        <div style={{ height: "300px" }}>
          <Grid item xs={12} style={{marginTop: "-10px", width: "222px"}}>
          <Select
            className="form-input"
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            placeholder="Select Template"
            variant="outlined"
            value={this.props.openSMSForm.temp1}
            onClick={() => this.handleChange("temp1", null)}
            onChange={(e) => {
              this.handleChange("temp2", null)
              this.handleChange("temp1", e)
              { (e.value !== "Template 1" && e.value !== "Template 2") ?
              this.handleChange("smsText", e.value) : this.handleChange("smsText", "")
              }
            }}
            options={[
              {label: "Template 1", value: "Template 1"}, 
              {label: "Template 2", value: "Template 2"}, 
              {label: "Template 3", value: "Selected Template 3"}, 
              {label: "Template 4", value: "Selected Template 4"}, 
              {label: "Template 5", value: "Selected Template 5"}
            ]}
          />
          </Grid>
          {this.props.openSMSForm.temp1 && (this.props.openSMSForm.temp1.value === "Template 1" || this.props.openSMSForm.temp1.value === "Template 2") && 
          (<Grid item xs={12} style={{marginTop: "-10px", width: "222px"}}>
            <Select
              className="form-input"
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              placeholder="Select Template"
              variant="outlined"
              value={this.props.openSMSForm.temp2}
              onChange={(e) => {
                this.handleChange("temp2", e)
                this.handleChange("smsText", e.value)
              }}
              options={this.props.openSMSForm.temp1.label === "Template 1" && 
                [{label: "Template 1", value: "Selected Text Template1 - 111"}, 
                {label: "Template 2", value: "Selected Text Template1 - 222"}, 
                {label: "Template 3", value: "Selected Text Template1 - 333"}, 
                {label: "Template 4", value: "Selected Text Template1 - 444"}, 
                {label: "Template 5", value: "Selected Text Template1 - 555"}]
                ||
                this.props.openSMSForm.temp1.label === "Template 2" && 
                [{label: "Template 1", value: "Selected Text Template2 - 111"}, 
                {label: "Template 2", value: "Selected Text Template2 - 222"}, 
                {label: "Template 3", value: "Selected Text Template2 - 333"}, 
                {label: "Template 4", value: "Selected Text Template2 - 444"}, 
                {label: "Template 5", value: "Selected Text Template2 - 555"}]

              }
            />
          </Grid>)
          }
          <Grid item xs={12} style={{marginTop: "-10px", marginRight: "-20px"}}>
          <TextField
            id="filled-textarea"
            placeholder="Type Text Here"
            rows={4}
            style={{width: "200px"}}
            value={this.props.openSMSForm.smsText}
            onChange={(e) => {
              console.log("smatext: ",e)
              this.handleChange("smsText", e.target.value)
            }}
            variant="outlined"
            multiline={true}
            className="r-select"
          />
          </Grid>
          <div className="button-container">
            <Button
              onClick={() => this.setState({ showStatsModal: false })}
              variant="contained"
              color="default"
            >
              CANCEL
            </Button>
            <a href={`sms:${phoneNumber}?body=${this.props.openSMSForm.smsText}`}>
              <Button
                onClick={() => {console.log(`sms:${phoneNumber}?body=${this.props.openSMSForm.smsText}`), this.setState({ showStatsModal: false })}}
                variant="contained"
                color="primary"
              >
                SMS
              </Button>
            </a>
          </div>
        </div>
      </BaseModal>
    )
  }

  public render() {
    var leadsData;
    if (this.state.sortType === "asc") {
      leadsData = this.props.leadsData.sort((a, b) => new Date(a.createddate) - new Date(b.createddate))
    }
    else if (this.props.leadsData === "dsc") {
      leadsData = this.props.leadsData.sort((a, b) => new Date(b.createddate) - new Date(a.createddate))
    }
    else {
      leadsData = this.props.leadsData
    }

    console.log("leadsData: ", leadsData);
    console.log("this.state.activeTabType:", this.state.activeTabType)
    console.log("this.state.selectedFilterValues ", this.state.selectedFilterValues)

    return (
      <AppBar>
        {this.renderAssignDealerModal()}
        {this.openSMSModel()}
        {/* {this.renderFilterModal()} */}
        <div className="leads">
          {isDealer() ? ( leadsData !== undefined && 
            <Tabs tabsData={this.tabDataForDealer(leadsData)}
              hasSort={true}
              sortValue={(sortVal) => this.setState({ sortType: sortVal })}
            />
          ) : ( leadsData !== undefined && 
              <React.Fragment>
                <Tabs tabsData={this.tabData(leadsData)} />

                {this.state.topActiveTab === "Customer" &&
                  <Tabs tabsData={this.tabDataToDisplay(leadsData)} />
                }
              </React.Fragment>
            )}
        </div>
        <span
          onClick={() => this.props.history.push("/lead/add-new-lead")}
          style={{ position: "absolute", right: 20, bottom: 20 }}
        >
          <Fab color="secondary" aria-labelledby="add-ticket">
            <Add />
          </Fab>
        </span>
      </AppBar>
    );
  }
}
export function mapStateToProps(state) {
  console.log("state.user.leads: ", state.users.get("assigndealers"))
  return {
    isDealer: false,
    leadsData: state.users.get("leads"),
    dealersData: state.users.get("assigndealers"),
    openSMSForm: state.rxFormReducer["openSMSForm"],
  };
}
export const Leads = withRouter(
  connect<{}, {}, ILeadsProps>(mapStateToProps)(LeadsImpl) as any
);

const CardDetails = (props: any) => {
  const { details, AssignedDealers } = props;
  const assignedDealer = AssignedDealers && AssignedDealers.filter((item) =>
    item.sfid === details.assigned_dealer__c)

  const CalRating = () => {
    switch (details.rating) {
      case ("Cold"): return 1;
      case ("Warm"): return 3;
      case ("Hot"): return 5;
    }
  }
  return (
    <div className="card-container" >
      <Grid container >
        <Grid className="padding-6-corners" item xs={6} md={6} >
          {/* <span className="description-text">Name:</span> */}
          <PersonPin /> <span style={{ padding: "5px" }} />
          <div style={{marginTop: '-25px', marginLeft: '25px'}}>{details.name}</div>
        </Grid>
        <Grid className="padding-6-corners" item xs={6} md={6}>
          {/* <span className="description-text">Contact:</span> */}
          <Phone /> <span style={{ padding: "5px" }} />
          <div style={{marginTop: '-25px', marginLeft: '25px'}}>
            {details.whatsapp_number__c && ChangePhoneFormat(details.whatsapp_number__c)}
          </div>
          {/* {details.whatsapp_number__c && ChangePhoneFormat(details.whatsapp_number__c)} */}
        </Grid>
      </Grid>
      <Grid container >
        <Grid className="padding-6-corners" item xs={6} md={6} >
          <span className="description-text">Kit Enquiry :</span>
          {details.kit_enquiry__c}
        </Grid>
        <Grid className="padding-6-corners" item xs={6} md={6}>
          <span className="description-text">Vehicle Type :</span>
          {details.x3_or_4_wheeler__c === "3 Wheeler" ? "3Wheeler" : "4Wheeler"}
        </Grid>
      </Grid>
      {details.assigned_dealer__c || details.recordtypeid === "0122w000000cwfSAAQ" ? (
        // <React.Fragment>
        <Grid container>
          <Grid className="padding-6-corners" item xs={6} md={6}>
            <span className="description-text">Assigned Dealer : </span>
            {/* {assignedDealer && assignedDealer[0] && assignedDealer[0].name} */}
            {details.dealer_generated__c}
          </Grid>
          <Grid className="padding-6-corners" item xs={6} md={6}>
            <span className="description-text">Lead Rating :</span>
            {details.rating}
            {/* <Rating
                      readOnly
                      precision={0.5}
                      value={CalRating()}
                    /> */}
          </Grid>
        </Grid>
        // </React.Fragment>
      ) : (
        ""
        )}
      <Grid container >
        <Grid className="padding-6-corners" item xs={4} md={4}>
          <span>{"            "}</span>
          <span className="view"
            onClick={() => {
              props.onClickDetails(details)
            }}>
            View Details
          </span>
        </Grid>
        <Grid className="padding-6-corners" item xs={8} md={8}>
          <div className="icon-container" style={{marginTop: '-8px'}}>
            <a href={"tel:" + details.whatsapp_number__c}>
              <PhoneIcon className="phone-icon" />
            </a>
            &nbsp;
              <ChatIcon onClick={() => props.smsClick(details.whatsapp_number__c)} className="chat-icon" />
            &nbsp;
            <a href={`mailto:${details.email}?subject=The subject of the mail&body=The Body of the mail`}>
              <MailIcon className="mail-icon" />
            </a>
            &nbsp;
            <a href={`https://api.whatsapp.com/send?phone=91${details.whatsapp_number__c}&text=example Leads`}>
              <img
                height="42px"
                src={WhatsappIcon}
              // src="https://img.icons8.com/color/48/000000/whatsapp.png"
              />{" "}
            </a>
          </div>
        </Grid>
      </Grid>{" "}
      {details.assigned_dealer__c || details.recordtypeid === "0122w000000cwfSAAQ" ? "" :
        <Grid container >
          <span className="clickable" onClick={() => props.onClickAssign(details.sfid)}>
            {details.recordtypeid === "0122w000000chRpAAI" && !details.assigned_dealer__c ? "Click To Assign Dealer" : ""}
          </span>
        </Grid>
      }
    </div>
    //     )}
    //   )}
    // </div>
  );
};

const CardDetailsForDealer = (props: any) => {
  const { details } = props;
  const CalRating = () => {
    switch (details.rating) {
      case ("Cold"): return 1;
      case ("Warm"): return 3;
      case ("Hot"): return 5;
    }
  }
  return (
    <div className="card-container">
      <Grid container >
        <Grid item className="padding-6-corners" xs={6} md={6}>
          <PersonPin /> <span style={{ padding: "5px" }} />
          <div style={{marginTop: '-25px', marginLeft: '25px'}}>{details.firstname +' '+ details.lastname}</div>
        </Grid>
        <Grid item className="padding-6-corners" xs={6} md={6}>
          <Phone /> <span style={{ padding: "5px" }} />
          <div style={{marginTop: '-25px', marginLeft: '25px'}}>
          {details.whatsapp_number__c && ChangePhoneFormat(details.whatsapp_number__c)}
          </div>
        </Grid>
      </Grid>
      {isDealer() &&
      <Grid container >
        <Grid className="padding-6-corners" item xs={6} md={6}>
          <span className="description-text">Kit Enquiery:</span>
          {details.kit_enquiry__c}
        </Grid>
        <Grid className="padding-6-corners" item xs={6} md={6}>
          <span className="description-text"> Vehicle Type:</span>
          {details.x3_or_4_wheeler__c === "3 Wheeler" ? "3Wheeler" : "4Wheeler"}
        </Grid>
      </Grid>}
      <Grid container >
        <Grid item className="padding-6-corners align-center" xs={6} md={6}
          style={{ justifyContent: "flex-start" }}>
          <span className="description-text">Lead Rating:</span>
          {details.rating}
          {/* <Rating
            readOnly
            precision={0.5}
            value={CalRating()}
          /> */}
        </Grid>
        {!isDealer() &&
        <Grid className="padding-6-corners" item xs={6} md={6}>
          <span className="description-text">City:</span>
          {details.city}
        </Grid>
        }
      </Grid>
      <Grid container >
        <Grid className="padding-6-corners" item xs={4} md={4}>
          <span
            onClick={() => props.onClickDetails(details)}
            className="view"
          >
            View Details
          </span>
        </Grid>
        <Grid className="padding-6-corners" item xs={8} md={8}>
          <div className="icon-container" style={{marginTop: '-8px'}}>
            <a href={"tel:" + details.whatsapp_number__c}>
              <PhoneIcon className="phone-icon" />
            </a>
            &nbsp;
              <ChatIcon onClick={() => props.smsClick(details.whatsapp_number__c)} className="chat-icon" />
            &nbsp;
            <a href={`mailto:${details.email}?subject=The subject of the mail&body=The Body of the mail`}>
              <MailIcon className="mail-icon" />
            </a>
            &nbsp;
            <a href={`https://api.whatsapp.com/send?phone=91${details.whatsapp_number__c}&text=example Leads`}>
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
  );
};
