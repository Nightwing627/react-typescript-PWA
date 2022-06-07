// import { Modal } from "@material-ui/core";
import * as React from "react";
import "./resuableComponent.scss";
import Modal from "react-bootstrap-modal";

export interface IBaseModalProps {
  open: boolean;
  onClose: any;
  className?: string;
  contentClassName?: string;
}

export class BaseModal extends React.PureComponent<IBaseModalProps, {}> {
  state = {
    show: true,
  };

  public render() {
    return (
      <Modal
        className="modal-container-main"
        show={this.props.open}
        onHide={this.props.onClose}
        aria-labelledby="ModalHeader"
      >
        <Modal.Header closeButton></Modal.Header>
        <div className="modal-content-main">
          <div className="modal-container">{this.props.children}</div>
        </div>
      </Modal>

      // <Modal
      //   aria-labelledby="simple-modal-title"
      //   aria-describedby="simple-modal-body"
      //   className={`modal ${this.props.className}`}
      //   open={this.props.open}
      //   onBackdropClick={this.props.onClose}
      //   onClose={this.props.onClose}
      // >
      //
      // </Modal>
    );
  }
}
