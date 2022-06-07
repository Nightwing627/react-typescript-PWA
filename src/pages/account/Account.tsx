import * as React from "react";
import { User } from "../../state/User";
import LoginPage from "./Login";

interface IAccountProps {
  login?: (data: any) => void;
  match?: any;
  location?: any;
  classes?: any;
  user: User;
}

export class AccountPage extends React.Component<IAccountProps, {}> {
  private renderLogin = () => {
    return (
      <LoginPage
        user={this.props.user}
        login={this.props.login}
        match={this.props.match}
        location={this.props.location}
      />
    );
  };

  public render(): JSX.Element {
    return this.renderLogin();
  }
}
