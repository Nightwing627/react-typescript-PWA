import * as React from "react";
import { Button } from "@material-ui/core";

export class Stepper extends React.Component<any, any> {
  state = { activeStep: this.props.activeStep, stepData: this.props.stepData, isAlreadyUpdate: false };

  shouldComponentUpdate(nP, nS) {
    const current = document.getElementsByClassName("active")[0];
    if (current) {
      current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
    if (nP.activeStep && nS.activeStep !== nP.activeStep) {
        this.setState({
          activeStep: nP.activeStep,
        });
      return true;
    }
    if (this.props.identifier !== nP.identifier) {
      this.setState({
        activeStep: nP.activeStep || 0,
      });
      return true;
    }
    if (this.state.activeStep !== nS.activeStep) {
      return true;
    }
    return false;
  }

  render() {
    const {
      props,
      state: { activeStep },
    } = this;
    return (
      <div className="stepper-container">
        <div className="step-container">
          {props.stepData.map((step: any, index: number) => {
            return (
              <div
                key={index}
                onClick={() => {
                  this.setState({ activeStep: index });
                  this.props.onChangeStep && this.props.onChangeStep(index);
                  console.log("index: ", index)
                }}
                className={`step ${
                  index === this.state.activeStep || index === props.activeStep
                    ? "active"
                    : ""
                }`}
              >
                <StpperBG
                  fill={
                    index <= activeStep || index <= props.activeStep
                      ? "#48a89c"
                      : "#b5b5b5"
                  }
                />
                <div className="step-label">
                  {" "}
                  <div className="step-label-inner">{step.label}</div>{" "}
                </div>
              </div>
            );
          })}
        </div>
        <div className="stepper-content">
          {props.activeStep && props.activeStep < props.stepData.length
            ? props.stepData[props.activeStep]
              ? props.stepData[props.activeStep].component
              : props.stepData[0].component
            : props.stepData[activeStep]
            ? props.stepData[activeStep].component
            : props.stepData[0].component}
        </div>
      </div>
    );
  }
}

const StpperBG = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="150"
      height="60"
      viewBox="0 0 979 382"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M793 26H0V32.4207L161.991 191.599L0 350.777V356H793V26Z"
        fill={props.fill}
      />
      <path d="M979 191L791.5 356.411V25.5891L979 191Z" fill={props.fill} />
    </svg>
  );
};
