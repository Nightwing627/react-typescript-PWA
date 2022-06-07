import * as React from "react";
import BaseLogo from "./BaseLogo.png";
import Card from "@material-ui/core/Card";
import { isEmpty } from "lodash";
import "./Login.scss";
import Axios from "axios";
import { Typography } from "@material-ui/core";
import { NavLink, withRouter } from "react-router-dom";
import { saveLoggedInUserData, saveLoggedInUserToken } from "src/state/Utility";
import { saveLoggedInUserDetails } from "src/actions/App.Actions";
import * as AppActionCreators from "../../actions/App.Actions";
import getData from "src/utils/getData";

const LoginScreenImpl = (props: any) => {
  const [userName, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [userError, setUserError] = React.useState("");
  // const [passwordError, setPassError] = React.useState("");

  const handleLogin = async () => {
    AppActionCreators.closeDrawer();
    if (isEmpty(userName) || isEmpty(password)) {
      return;
    }
    if (userName === "Demo" && password === "demo") {
        saveLoggedInUserData({ userName });
        saveLoggedInUserDetails({ userName, isDealer: true, isDist: false });
        props.history.push({pathname: "/home", showStatsModal: true});
    } 
    if (userName === "DemoDist" && password === "demo") {
        saveLoggedInUserData({ userName });
        saveLoggedInUserDetails({ userName, isDealer: false, isDist: true });
        props.history.push({pathname: "/home", showStatsModal: true});
    }
  };

  const handleSignIn = async () => {
    AppActionCreators.closeDrawer();
    console.log(userName, "  ", password)
    try {
        if(userName === "" && password === ""){
          throw "Please Enter Username and Password"
        }
        else if(password === ""){
          setUserError("Please Enter Password");
          return;
        }
        else if(userName === ""){
          setUserError("Please Enter Username");
          return;
        }

        const data = await fetch('https://grecokits.herokuapp.com/login.php', {
        // headers: { "Content-Type": "application/json" },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
            username: userName,
            password: password
        }),
        method: "POST"
      }).then(r => {
        if (r.ok) {
            return r.json()
        } else {
            throw r
        }
      })
      console.log(data.token)
      // if (data.status !== "200") {
      // const AllUser = (await getData({
      //   query: `SELECT username__c, password__c from salesforce.Account where username__c = '${userName}'`,
      //   token: data.token
      // }));
      // console.log(AllUser);
      // }
      if (data.status === "200") {
        if(data.record_type === "0122w000000cwfSAAQ"){
          saveLoggedInUserData({ recordType: data.record_type });
          saveLoggedInUserToken({ data });
          saveLoggedInUserDetails({ data, isDealer: true, isDist: false });
          props.history.push({pathname: "/home", showStatsModal: true});
        return {}
        }
        else if(data.record_type === "0122w000000cwfNAAQ"){
          saveLoggedInUserData({ recordType: data.record_type });
          saveLoggedInUserToken({ data });
          saveLoggedInUserDetails({ data, isDealer: false, isDist: true });
          props.history.push({pathname: "/home", showStatsModal: true});
        return {}
        }
      }
      else{
        throw "Please Enter Valid Credentials"
      }
      
    } catch (e) {
        console.error("catch ERROR =>", e)
        setUserError(e);
    }
  }

  return (
    <div className="main-container">
      <div className="login-main">
        <Card className="login-container">
          <div>
            <img src={BaseLogo} alt="login" height="100px" />
          </div>
          
          {userError ?
            <Typography
              variant="subtitle1"
              style={{
                color: "red",
                fontSize: "12px"
              }}
              gutterBottom
            >
              {userError}
            </Typography>
          : null}

          <div className="input-conttainer">
            <input
              onChange={(e) => setName(e.target.value)}
              className="login-input"
              value={userName}
              type="text"
              placeholder="Username"
            />
          </div>
          <div className="input-conttainer">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              type="password"
              placeholder="Password"
            />
          </div>
          <div
            onClick={() => props.history.push("/forgot-password")}
            className="forgot-password"
          >
            Forgot Password ?
          </div>
          <div>
            <button onClick={handleSignIn} className="login-button">
              Login
            </button>
          </div>
          <div className="forgot-password">Apply for Dealer/Distributor</div>
        </Card>
        <div className="account-note">
          Have not an account yet? <NavLink to="/signup"> Sign up</NavLink>
        </div>
      </div>
    </div>
  );
};

export const LoginScreen = withRouter(LoginScreenImpl);