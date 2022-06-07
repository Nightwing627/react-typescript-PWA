import ChatIcon from "@material-ui/icons/Chat";
import MailIcon from "@material-ui/icons/Mail";
import PhoneIcon from "@material-ui/icons/Phone";
import * as React from "react";
import { connect } from "react-redux";
import { saveSelectData } from "src/actions/App.Actions";
import { getToken } from "src/state/Utility";
import getData from "src/utils/getData";
import AppBar from "src/navigation/App.Bar";
import { ChangePhoneFormat } from "src/components/Format";
import "./profile.scss";

export interface IProfileProps { profileData?: any}
export class ProfileImpl extends React.PureComponent<IProfileProps, {}> {

  componentDidMount(){
    const loggedInUserDetails = getToken().data;
    this.getprofileData(loggedInUserDetails);
  }
  getprofileData = async (data) => {
    try{
      const getprofile = await getData({
        query: `SELECT *
        FROM Salesforce.account
        WHERE sfid = '${data.sfid}' `,
        token: data.token
      })
      console.log("getprofile => ", getprofile);
      saveSelectData(getprofile.result);
      // return getprofile.result;
    }
    catch(e){
      console.log(e);
    }
  }

  public render() {
    console.log("this.props: ", this.props)
    const { profileData } = this.props;

    return (
      <AppBar>
        {profileData && 
        <div className="profile-container">
          <div className="card-container no-hover">
            <div className="profile-data">
              <b>Dealer ID : {profileData[0].id}</b>
            </div>

            <div className="profile-data">
              {profileData[0].name}{" "}
            </div>

            <div className="profile-data">
              <div>
                <MailIcon color="primary" />
                <span style={{ paddingRight: "5px" }}></span> {profileData[0].email__c}
              </div>
              <div>
                <PhoneIcon color="primary" />
                <span style={{ paddingRight: "5px" }}></span> {profileData[0].phone && ChangePhoneFormat(profileData[0].phone)}
              </div>
              <div>
                <ChatIcon color="primary" />
                <span style={{ paddingRight: "5px" }}></span> {profileData[0].whatsapp_no__c && ChangePhoneFormat(profileData[0].whatsapp_no__c)}
              </div>
            </div>

            <div className="profile-data">
              {profileData[0].billingstreet} {profileData[0].billingcity} {profileData[0].billingstate} {profileData[0].billingpostalcode} {profileData[0].billingcountry}
            </div>
          </div>
        </div>
       }
      </AppBar>
    );
  }
}
export function mapStateToProps(state) {
  return {
    profileData : state.users.get("selectdata"),
  };
}
export const Profile = connect<{}, {}, IProfileProps>(mapStateToProps)(
  ProfileImpl
);