import * as React from "react";

export class BasePage extends React.PureComponent<{}, {}> {
  public render() {
    return this.props.children;
  }
}
