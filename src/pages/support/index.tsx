import { Button, Fab, TextField, Grid } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import * as React from "react";
import { BaseModal } from "src/components/BaseModal";
import AppBar from "src/navigation/App.Bar";
import { getToken } from "src/state/Utility";
import getData from "src/utils/getData";
import "./support.scss";
import { saveLoggedInUserDetails } from "src/actions/App.Actions";

var LoggedInUserDetails;
const supportData = [
  {
    sr: "101",
    case: "Case 101",
    title: "Kit Replacement",
    desc:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

export class Support extends React.PureComponent<{}, any> {
  public state = { fileName: "", isModalOpen: false, data: [] , sub: "", desc: ""};

  async componentDidMount(){
    LoggedInUserDetails = getToken().data;
    const res = await this.getAllSuppotCases(LoggedInUserDetails);
    console.log(res);
    this.setState({ data: res });
  }
  
  getAllSuppotCases = async (data) => {
    try{
      const getsupportcases = await getData({
        query: `SELECT *
        FROM salesforce.case 
        WHERE accountid like '%${data.sfid}%'`,
        token: data.token
      })
      console.log("getsupportcases => ", getsupportcases);
      return getsupportcases.result;
    }
    catch(e){
      console.log(e);
    }
  }

  InsertSupportCase = async (data, subj, desc) => {
    console.log("data: ", data);
    try{
      const insetcase = await getData({
        query: `insert into salesforce.case
        (Subject, Description, Status, Priority, Origin, Accountid) 
        Values('${subj}', '${desc}', 'New', 'High', 'Email', '${data.sfid}')`,
        token: data.token
      });
      console.log("insetcase => ", insetcase);
      return insetcase.result;
    }
    catch(e){
      console.log(e);
    }
  }

  handleSubmit = async() => {
    this.InsertSupportCase(LoggedInUserDetails, this.state.sub, this.state.desc);
    const res = await this.getAllSuppotCases(LoggedInUserDetails);
    console.log(res);
    this.setState({ data: res });
    this.setState({
      isModalOpen: false,
    });
    // const d = this.state.data;
    // const last = this.state.data[this.state.data.length - 1];
    // d.push({
    //   casenumber: `Case ${last.sr + 1}`,
    //   sr: last.sr + 1,
    //   subject: this.state.sub,
    //   description: this.state.desc,
    // });
  };

  public render() {
    const cases = this.state.data.sort((a,b) => 
      // Number(a.casenumber.substr(a.casenumber.length - 3)) - Number(b.casenumber.substr(b.casenumber - 3))
      new Date(a.createddate) - new Date(b.createddate)
      )
    console.log("cases: ", cases);
    return (
      <AppBar>
        <div style={{ padding: "10px" }}>
          <h3>Support Requests</h3>
          <Grid container>
            {cases.map((sup) => (
              <Grid item xs={12} sm={6} lg={6}>
                <div className="card-container no-hover">
                  <div className="case"> {sup.casenumber}</div>
                  <div className="title">
                    <span className="description-text">Case For:</span>{" "}
                    {sup.subject}
                  </div>
                  <div className="desc">{sup.description}</div>
                  <div className="view-attachment">View Attachment</div>
                </div>
              </Grid>
            ))}
          </Grid>
          <BaseModal
            className="support-modal"
            contentClassName="support-content"
            onClose={() => this.setState({ isModalOpen: false })}
            open={this.state.isModalOpen}
          >
            <div className="head-title">Submit New Case</div>
            <form className="form-content" autoComplete="off">
              <TextField
                id="outlined-basic"
                label="Subject Line"
                className="form-input"
                onChange={(e) => this.setState({ sub: e.target.value })}
                variant="outlined"
              />
              <TextField
                className="form-input"
                id="outlined-basic"
                label="Message"
                multiline={true}
                rows={4}
                variant="outlined"
                onChange={(e) => this.setState({ desc: e.target.value })}
              />
              <div style={{ maxWidth: "300px" }} className="description-text">
                {this.state.fileName}
              </div>
              <div className="button-container">
                <Button variant="contained" onClick={this.handleSubmit}>
                  <input
                    onChange={(e) =>
                      this.setState({ fileName: e.target.files[0].name })
                    }
                    id="attachFile"
                    className="hidden"
                    type="file"
                  />
                  <label htmlFor="attachFile">Attach File</label>
                </Button>
                <span style={{ padding: "5px" }} />
                <Button
                  onClick={this.handleSubmit}
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>
              </div>
            </form>
          </BaseModal>
          <span
            style={{ position: "absolute", right: 20, bottom: 20 }}
            onClick={() => this.setState({ isModalOpen: true })}
          >
            <Fab color="secondary" aria-labelledby="add-ticket">
              <Add />
            </Fab>
          </span>
        </div>
      </AppBar>
    );
  }
}
