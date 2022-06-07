import * as React from "react";
import { connect } from "react-redux";
import AppBar from "src/navigation/App.Bar";
import { Edit, Add } from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import { BaseModal } from "src/components/BaseModal";
import { SubFormHeading } from "src/components/SubFormHeading";
import { FormComponent } from "src/components/FormComponent";
import getData from "src/utils/getData";
import { saveSelectData } from "src/actions/App.Actions";
import data from "src/data";
import { getToken, changeValuesInStore } from "src/state/Utility";
import { Button, Fab, TextField, Grid, Select, MenuItem } from "@material-ui/core";
// import Select from "react-select";
import { values } from "lodash";
import {ChangePhoneFormat} from "src/components/Format";

var loggedInUserDetails;
const users = [
  {
    name: "Dinesh KK",
    email: "asdssd@asdsd.com",
    mobileNumber: "8999988989",
    role: "Role & Sales",
  },
  {
    name: "Dinesh KK",
    email: "asdssd@asdsd.com",
    mobileNumber: "8999988989",
    role: "Role & Sales",
  },
  {
    name: "Dinesh KK",
    email: "asdssd@asdsd.com",
    mobileNumber: "8999988989",
    role: "Role & Sales",
  },
  {
    name: "Dinesh KK",
    email: "asdssd@asdsd.com",
    mobileNumber: "8999988989",
    role: "Role & Sales",
  },
];

const userFormOptions = [
  {
    label: "First Name",
    type: "text",
    model: ".firstName",
    required: true,
  },
  {
    label: "Last Name",
    required: true,
    type: "text",
    model: ".lastName",
  },
  {
    label: "Email",
    type: "text",
    model: ".email",
    required: true,
  },
  {
    label: "WhatsApp Number",
    type: "text",
    model: ".phone",
    required: true,
  },
  {
    label: "Role",
    required: true,
    type: "select",
    model: ".role",
    options: [
      {label: "Sales", value: "Sales"},
      {label: "Inventory", value: "Inventory"},
      {label: "Account", value: "Account"},
    ],
  },
];

export interface IMyUsersProps { values?: any, MyUsers?: any}

export class MyUsersImpl extends React.PureComponent<
  IMyUsersProps,
  { openEditModal: boolean; data: any; }
> {
  constructor(props: IMyUsersProps) {
    super(props);
    this.state = { openEditModal: false, data: null };
  }

  componentDidMount(){
    loggedInUserDetails = getToken().data;
    this.getAllUsers(loggedInUserDetails);
  }

  getAllUsers = async (data) => {
    try{
      const getUsers = await getData({
        query: `SELECT Firstname, Lastname, Name, Phone, Whatsapp_number__c, Email, Role__c, username__c, Password__c, sfid, id
        FROM salesforce.Contact 
        WHERE contact.accountid LIKE '%${data.sfid}%' and RecordtypeId ='0121s0000000WDzAAM'  `,
        token: data.token
      })
      console.log("getUsers => ", getUsers);
      saveSelectData(getUsers.result);
      // return getUsers.result;
    }
    catch(e){
      console.log(e);
    }
  }

  InsertUpdateMyUser = async (data, values) => {
    console.log("Values ", values);
    let insertuser;
    try{
      if(values.id){
      insertuser = await getData({
        query: `UPDATE salesforce.contact SET 
          FirstName = '${values.firstName}', 
          LastName = '${values.lastName}', 
          Name = '${values.firstName} ${values.lastName}',
          Email = '${values.email}', 
          Phone = '${values.phone}' , 
          Role__c = '${values.role}' 
          where Id = '${values.id}'`,
        token: data.token
      })
    }else{
      insertuser = await getData({
        query: `INSERT into salesforce.contact 
          (FirstName, LastName, Name, Email, Phone, Role__c, RecordTypeid, accountid) 
          values (
            '${values.firstName}', '${values.lastName}', '${values.firstName} ${values.lastName}',
            '${values.email}', '${values.phone}', '${values.role}', 
            '0121s0000000WDzAAM', '${data.sfid}'
          ) RETURNING id`,
        token: data.token
      })
    }
      console.log("insertuser => ", insertuser);

    }catch(e){
      console.log(e);
    }
  }

  deleteMyUser = async(data, values) => {
    console.log("values ", values);

    try{
      const deleteuser = await getData({
        query: `DELETE FROM Salesforce.contact where Id = '${values.id}'`,
        token: data.token
      })
      console.log("deleteuser => ", deleteuser);
      return deleteuser;

    }catch(e){
      console.log(e);
    }
  }

  handleChange = (event, key) => {
    console.log(event)
    changeValuesInStore(`editUserForm.${key}`, event.target.value);
  };

  renderModal = () => {
    console.log("this.props: ", this.props);
    const { values } = this.props;

    return (
      <BaseModal
        className="leads-modal"
        contentClassName="leads-content"
        onClose={() => {this.setState({ openEditModal: false }); changeValuesInStore(`editUserForm`, {})}}
        open={this.state.openEditModal}
      >
        <Grid container spacing={1} className="">
          <SubFormHeading>
            {values.sfid ? `Edit User ${values.firstName} ${values.lastName}` : "Add New User" }
          </SubFormHeading>
          <Grid container className="modal-margin" xs={12} md={12}>
            <FormComponent
              onCancel={() => this.setState({ openEditModal: false })}
              options={userFormOptions}
              onSubmit={(v)=> {
                // this.InsertUpdateMyUser(loggedInUserDetails, values);
                console.log(">>v", v)
                this.getAllUsers(loggedInUserDetails);
                changeValuesInStore(`editUserForm`, {})
                this.setState({ openEditModal: false });
              }}
              hasSubmit={true}
              formModel="editUserForm"
            />
          {/* <Grid item={true} xs={12} md={6} sm={6}>
            <TextField
              className="form-input"
              id="outlined-basic"
              label="First Name"
              variant="outlined"
              value={values.firstName}
              onChange={(e) => this.handleChange(e, "firstName")}
            />
          </Grid>
          <Grid item={true} xs={12} md={6} sm={6}>
            <TextField
              className="form-input"
              id="outlined-basic"
              label="last Name"
              variant="outlined"
              value={values.lastName}
              onChange={(e) => this.handleChange(e, "lastName")}
            />
          </Grid>
          <Grid item={true} xs={12} md={6} sm={6}>
            <TextField
              className="form-input"
              id="outlined-basic"
              label="E-Mail"
              variant="outlined"
              value={values.email}
              onChange={(e) => this.handleChange(e, "email")}

            />
          </Grid>
          <Grid item={true} xs={12} md={6} sm={6}>
            <TextField
              className="form-input"
              id="outlined-basic"
              label="WhatsApp Number"
              variant="outlined"
              value={values.phone}
              onChange={(e) => this.handleChange(e, "phone")}

            />
          </Grid>
          <Grid item={true} xs={12} md={6} sm={6}> */}
            {/* <Select
              className="form-input"
              id="outlined-basic"
              label="Role"
              // placeholder="Select Role"
              variant="outlined"
              value={ values.role && {label: values.role}}
              onChange={(e) => this.handleChange(e.value, "role")}
              options={[
                {label: "User", value: "User"}, 
                {label: "Manager", value: "Manager"}
              ]}
            /> */}
              {/* <TextField
              className="form-input"
              id="outlined-basic"
              label="Role"
              variant="outlined"
              select
              value={values.role}
              onChange={(e) => this.handleChange(e, "role")}
            >
              <MenuItem value="Sales">Sales</MenuItem>
              <MenuItem value="Inventory">Inventory</MenuItem>
              <MenuItem value="Account">Account</MenuItem>
              
            </TextField>
          </Grid>

            <FormComponent
              onCancel={() => {this.setState({ openEditModal: false }); changeValuesInStore(`editUserForm`, {})}}
              options={[]}
              onSubmit={(v)=> {
                this.InsertUpdateMyUser(loggedInUserDetails, values);
                this.getAllUsers(loggedInUserDetails);
                changeValuesInStore(`editUserForm`, {})
                this.setState({ openEditModal: false });
              }}
              hasSubmit={true}
              formModel="editUserForm"
            />  */}
          </Grid>
        </Grid>
      </BaseModal>
    );
  };

  render() {
    return (
      <AppBar>
        <Grid container>
          {this.renderModal()}
          {this.props.MyUsers && this.props.MyUsers.map((us) => (
            <UserCard
              handleEditModelOprn={(data) =>{
                this.setState({ openEditModal: true})
                const editData = {
                  firstName: data.firstname,
                  lastName: data.lastname,
                  email: data.email,
                  phone: data.phone,
                  role: data.role__c,
                  id: data.id,
                }
                changeValuesInStore(`editUserForm`, editData);          
              }}
              handleClickDelete={(data) => {
                this.deleteMyUser(loggedInUserDetails, data);
                this.getAllUsers(loggedInUserDetails);
              }}
              details={us}
            />
          ))}
          <span
            style={{ position: "absolute", right: 20, bottom: 50 }}
            onClick={() => this.setState({ openEditModal: true })}
          >
            <Fab color="secondary" aria-labelledby="add-ticket" >
              <Add />
            </Fab>
          </span>
        </Grid>
      </AppBar>
    );
  }
}

export function mapStateToProps(state) {
  return {
    // values: store.getState().rxFormReducer["editUserForm"],
    MyUsers: state.users.get("selectdata") ,
    values: state.rxFormReducer["editUserForm"],
  };
}

export const MyUsers = connect<{}, {}, IMyUsersProps>(mapStateToProps)(
  MyUsersImpl
);

const UserCard = (props) => {
  const details = props.details;

  return (
    <Grid item xs={12} md={6}>
      <div className="card-container">
        <Grid container className="">
          <Grid className="padding-6-corners" item xs={12}  md={6} sm={6}>
            <span className="description-text">Name:</span>
            {details.name}
          </Grid>
          <Grid className="padding-6-corners" item xs={12}  md={6} sm={6}>
            <span className="description-text">Email:</span>
            {details.email}
          </Grid>
          <Grid className="padding-6-corners" item xs={12}  md={6} sm={6}>
            <span className="description-text">Mobile Number:</span>
            { details.phone && ChangePhoneFormat(details.phone) }
          </Grid>
          <Grid className="padding-6-corners" item xs={12}  md={6} sm={6}>
            <span className="description-text">Role:</span>
            {details.role__c}
          </Grid>
          <Grid className="padding-6-corners" item  xs={12} md={12} sm={12}
            style={{ textAlign: "right" }}
          >
            <Edit onClick={() => props.handleEditModelOprn(details)} />{" "}
            <span style={{ padding: "10px" }} />
            <DeleteIcon  onClick={() => props.handleClickDelete(details)}/> 
            <span style={{ padding: "10px" }} />
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
};