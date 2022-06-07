import * as React from "react";
import BaseLogo from "../BaseLogo.png";
import Card from "@material-ui/core/Card";
import "./Signup.scss";
import { withRouter, NavLink } from "react-router-dom";

const SignupScreenImpl = (props: any) => {
  const [userName, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setconfirmPassword] = React.useState("");
  const [accept, setAccept] = React.useState('0');

  const handleSignup = () => {
    if (userName && password.length > 3 && password === confirmPassword && accept === '1') {
      props.history.push({pathname: "/home", showStateModal: true});
    }
  };

  const handleAccept = () => {
    setAccept(  accept === '0' ? '1' : '0' );
  };

  return (
    <div className="main-container account-container">
      <div className="login-main">
        <Card className="signup-container">
          <div>
            <img src={BaseLogo} alt="signup" height="100px" />
          </div>
          <div className="input-container">
            <input
              onChange={(e) => setName(e.target.value)}
              className="signup-input"
              value={userName}
              type="text"
              placeholder="Username"
            />
          </div>
          <div className="input-container">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="signup-input"
              type="password"
              placeholder="Password"
            />
          </div>
          <div className="input-container">
            <input
                value={confirmPassword}
                onChange={(e) => setconfirmPassword(e.target.value)}
                className="signup-input"
                type="password"
                placeholder="Confirm Password"
            />
          </div>
          <div className="input-container">
            <input id="accept" type="checkbox"  value={accept}  onChange={handleAccept}/>
            <label htmlFor="accept">I accept the <a>Terms of Use</a> </label>
          </div>
          <div>
            <button onClick={handleSignup} className="signup-button">
              Sign Up
            </button>
          </div>
        </Card>
        <div className="account-note">
          Already have a account? <NavLink to="/"> Login here</NavLink>
        </div>
      </div>
    </div>
  );
};

export const SignupScreen = withRouter(SignupScreenImpl);
