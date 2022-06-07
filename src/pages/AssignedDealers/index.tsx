import * as React from "react";
import { connect } from "react-redux";
import AppBar from "src/navigation/App.Bar";
import { Grid } from "@material-ui/core";
import { userData } from "./usersData";
import "./asssignedDealers.scss";
import { saveDealerData } from "src/actions/App.Actions";
import { withRouter } from "react-router-dom";
import { IHistory } from "src/state/Utility";
import { getToken } from "src/state/Utility";
import getData from "src/utils/getData";
import moment from 'moment';
import { ChangePhoneFormat } from "src/components/Format";

export interface IAssignedDealersProps {
  history: IHistory;
}

export class AssignedDealersImpl extends React.Component<
  IAssignedDealersProps,
  { users: any; isLoading: boolean }
> {
  constructor(props: IAssignedDealersProps) {
    super(props);
    this.state = { users: [], isLoading: false };
  }

  
  async componentDidMount(){
    const {data} = getToken();
    const res = await this.getAllAssignedDealers(data);
    console.log("result ", res)
    this.setState({users : res});
  }

  getAllAssignedDealers = async (data) => {
    console.log("data: ",data);
    try {
        const assignedDealerData = await getData({
          query: `SELECT * FROM salesforce.Account 
          WHERE Assigned_Distributor__c = '${data.sfid}' AND RecordTypeId = '0122w000000cwfSAAQ'`,
          token: data.token
        })

        console.log("assignedDealerData =>", assignedDealerData);
        return assignedDealerData.result;
        
    } catch (e) {
        console.log('fetch Inventory Error', e)
    }
  }

  handleClickDetails = async (dealer) => {
    console.log("dealer Data ", dealer)
    saveDealerData({dealer});
    this.props.history.push(`/dealers/dealer-details/${dealer.recordtypeid}/${dealer.sfid}`);
  };

  render() {
    return (
      <AppBar>
        <Grid container>
          {this.state.users && this.state.users.map((d) => {
            return <DealerCard data={d} onClickItem={this.handleClickDetails} />;
          })}
        </Grid>
      </AppBar>
    );
  }
}
export function mapStateToProps() {
  return {};
}
export const AssignedDealers = withRouter(
  connect<{}, {}, IAssignedDealersProps>(mapStateToProps)(
    AssignedDealersImpl
  ) as any
);

const DealerCard = (props: any) => {
  const { data } = props;

  return (
    <Grid item xs={12} md={4} lg={4}>
      <div onClick={() => props.onClickItem(data)} className="card-container">
        <div className="inventory-card">
          {" "}
          <div className="padding-6"> {data.name}</div>
          <div className="margin-10 dealer-card">
            {/* <img src={"https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"} 
                 alt="bike" className="dealer-image" /> */}
            <div>
              <div className="padding-6"> {data.billingcity}, {data.billingstate}</div>
              <div className="padding-6">
                {" "}
                <span className="description-text">Contact Person</span>{" "}
                {data.contact_person__c}
              </div>
              <div className="padding-6">
                {" "}
                <span className="description-text">Phone</span> {data.phone && ChangePhoneFormat(data.phone)}
              </div>
              <div className="padding-6">
                {" "}
                <span className="description-text">Area</span> {data.area__c}
              </div>
            </div>
          </div>
          <div className="padding-6">
            <span className="description-text">Dealer Since</span> {moment(data.createddate).format("DD/MM/YYYY")}
          </div>
        </div>
      </div>
    </Grid>
  );
};