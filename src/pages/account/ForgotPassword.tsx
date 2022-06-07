import Card from "@material-ui/core/Card";
import * as React from "react";
import { withRouter } from "react-router-dom";
import { showNotification } from "src/state/Utility";
import BaseLogo from "./BaseLogo.png";
import "./Login.scss";

const ForgotPasswordImpl = (props: any) => {
  const [password, setPassword] = React.useState("");
  const [confPassword, setConfPassword] = React.useState("");
  const [err, setError] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [emailSubmitted, setEmailSubmitted] = React.useState(false);

  const isValid = () => password === confPassword;

  const handleSubmit = async () => {
    if (isValid()) {
      showNotification("Password Changed Successfully", "suceess");
      props.history.push("/");
      return;
    }
    showNotification("Please check the password and confirm password", "error");
  };

  const renderChangePasswordFields = () => (
    <React.Fragment>
      <div className="input-conttainer">
        <input
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          autoComplete="false"
          value={password}
          type="text"
          placeholder="Password"
        />
      </div>
      <div className="input-conttainer">
        <input
          value={confPassword}
          autoComplete="false"
          onChange={(e) => setConfPassword(e.target.value)}
          className="login-input"
          type="password"
          placeholder="Confirm Password"
        />
      </div>
      {!isValid() && (
        <div className="error">Confirm Password does not match..!!</div>
      )}
      <div>
        <button
          disabled={!isValid()}
          onClick={handleSubmit}
          className="login-button"
        >
          Change Password
        </button>
      </div>
    </React.Fragment>
  );

  const renderEmailInput = () => (
    <React.Fragment>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          showNotification(
            "Please wait validating email",
            "loading",
            "Email Vairfied, plese check inbox"
          );
          setTimeout(() => {
            setEmailSubmitted(true);
          }, 2000);
        }}
      >
        <div className="input-conttainer">
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
            value={email}
            type="email"
            placeholder="Email"
          />
        </div>
        <div>
          <button className="login-button" type="submit">
            Submit Email
          </button>
        </div>
      </form>
    </React.Fragment>
  );

  return (
    <div className="main-container">
      <div className="login-main">
        <Card className="login-container">
          <div>
            <img src={BaseLogo} alt="login" height="100px" />
          </div>
          <div className="forgot-password-text">Change your password here</div>
          {emailSubmitted ? renderChangePasswordFields() : renderEmailInput()}
        </Card>
      </div>
    </div>
  );
};

export const ForgotPassword = withRouter(ForgotPasswordImpl);
