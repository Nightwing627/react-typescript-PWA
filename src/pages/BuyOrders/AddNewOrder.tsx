import { Button, Grid, TextField, Typography } from "@material-ui/core";
import * as React from "react";
import { connect } from "react-redux";
import Select from "react-select";
import { Tabs } from "src/components/Tabs";
import AppBar from "src/navigation/App.Bar";
import { isDealer, IHistory } from "src/state/Utility";
import { Stepper } from "./Stepper";
import "./buyOrders.scss";
import { Add } from "@material-ui/icons";
import { Fab } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete"
import moment from 'moment';
import { GSelect } from "src/components/GSelect";
import getData from "src/utils/getData";
import { getToken } from "src/state/Utility";
import { saveOrderData } from "src/actions/App.Actions";
import { BaseModal } from "src/components/BaseModal";
import { values } from "lodash";

var loggedInUserDetails;

export interface IAddNewOrderProps {
  history: IHistory;
  isDealer: boolean;
  orderType: string;
  location: any;
  orderdetails: any;
}
const options = [
  { value: "loan", label: "Loan" },
  { value: "Upfront", label: "Upfront" },
];
const options1 = [
  { value: "CC/DC", label: "CC/DC" },
  { value: "Net Banking", label: "Net Banking" },
  { value: "UPI", label: "UPI" },
];
const products = [
  { value: "3 Wheeler - SKU1234", label: "3 Wheeler - SKU1234" },
  { value: "3 Wheeler - SKU1234", label: "3 Wheeler - SKU1234" },
  { value: "3 Wheeler - SKU1234", label: "3 Wheeler - SKU1234" },
];
const invoiceData = {
  orderID: "IN915426",
  dateOfIssue: "10/02/2020",
  billedTo: "GGFS",
  address: "Indiabulls, Lower Parel, Mumbai, MH 411093, India",
  totalItems: 25,
  orderTotal: 23123213,
  billHeads: ["Item Name", "Unit Cost", "Qty", "Amount"],
  billData: [
    {
      itemName: "Item 1 ",
      unitCost: "200",
      qty: "2",
      amount: "400",
    },
    {
      itemName: "Item 1 ",
      unitCost: "200",
      qty: "2",
      amount: "400",
    },
    {
      itemName: "Item 1 ",
      unitCost: "200",
      qty: "2",
      amount: "400",
    },
    {
      itemName: "Item 1 ",
      unitCost: "200",
      qty: "2",
      amount: "400",
    },
  ],
};

export class AddNewOrderImpl extends React.PureComponent<
  IAddNewOrderProps,
  any
> {
  constructor(props: IAddNewOrderProps, any) {
    super(props);
    this.state = {
      value: "",
      activeStepBuy: 0,
      activeStepSell: 0,
      orderedproducts: this.props.location.orderedproducts,
      orderdetails: this.props.location.orderdetails,
    };
  }

  componentDidMount(){
    loggedInUserDetails = getToken().data;
    console.log("loggedInUserDetails: ", loggedInUserDetails);
  }

  getAllOrderedProducts = async (data, orderdetails) => {
    console.log(orderdetails);
    console.log("data: ", data);
    try {
        const orderedproducts = await getData({
          query: `select * from salesforce.orderitem where orderid = '${this.state.orderdetails.sfid}'`,
          token: data.token
        })
        console.log("orderedproducts =>", orderedproducts);
        return orderedproducts.result;

    } catch (e) {
      console.log('fetch Inventory Error', e)
    }
  }

  UpdateAnOrder = async (data, orderdetails, details) => {
    console.log("data: ", data);
    console.log("orderdetails: ", orderdetails);
    console.log("details: ", details);

    let updateorder;
    try{
      if(details.details && details.details.paymentType ){
        updateorder = await getData({
          query: `UPDATE salesforce.order SET 
          Payment_Type__c = '${details.details.paymentType}', 
          Payment_Mode__c = '${details.details.paymentMode}', 
          Description = '${details.details.description}' 
          WHERE id='${orderdetails.id}'`,
          token: data.token
        });
      }
      else{
        updateorder = await getData({
          query: `UPDATE salesforce.order SET 
          Sold_To_Dealer__c = '${details}'
          WHERE id='${orderdetails.id}'`,
          token: data.token
        });   
      }
      console.log("updateorder => ", updateorder);
    }
    catch(e){
      console.log(e);
    }
  }

  InsertUpdateItems = async (data, orderdetails, selectedProducts) => {
    console.log("orderdetails ", orderdetails);
    console.log("selectedProducts ", selectedProducts);
    let insertuser;

    const SFID = await getData({
      query: `SELECT * from salesforce.order where Id = '${orderdetails.id}' `,
      token: data.token
    })
    console.log("SFID ", SFID.result);
    this.setState({ orderdetails: SFID.result[0] });

    try{

      selectedProducts.map(async (x) => 
        { x.itemNumber ? 
          insertuser = await getData({
            query: `update salesforce.orderitem set quantity = ${x.quantity} 
            where OrderItemNumber = '${x.itemNumber}' RETURNING id`,
            token: data.token
          }) 
        :
          x.label !== "" &&
            (insertuser = await getData({
              query: `INSERT INTO salesforce.orderitem 
              (pricebookentryid, product2id, quantity, orderid, unitprice) 
              VALUES (
                (select sfid from salesforce.pricebookentry where product2id like '%${x.sfid}%'),
                '${x.sfid}',
                  ${x.quantity},
                '${SFID.result[0].sfid}',
                (select unitprice from salesforce.pricebookentry where product2id like '%${x.sfid}%')
              )
              RETURNING id`,
              token: data.token
            }))
        }
      )
      console.log("insertuser =>0", insertuser);

    }catch(e){
      console.log(e);
    }
  }

  public onStepChange = (tabName: string) => {
    this.setState({
      value: tabName,
    });
  };

  public renderStepper = ( ) => {
    const { orderedproducts, orderdetails } = this.state;
    console.log("this.state: ", this.state)
    return (
      <Stepper
        identifier="buy"
        activeStep={this.state.activeStepBuy}
        onChangeStep={ (index) =>  this.setState({ activeStepBuy: index })}
        stepData={[
          {
            label: "Draft",
            component: 
            <RenderForm label="Submit" type="buy" history={this.props.history} 
              orderedproducts={orderedproducts} 
              onClick={( selectedProducts ) => {
                this.InsertUpdateItems(loggedInUserDetails, orderdetails, selectedProducts );
                this.setState({ activeStepBuy: this.state.activeStepBuy + 1 })
              }} 
            />,
            // this.renderForm("Submit", "buy"),
          },
          {
            label: "Submitted",
            component: (
              <SubmittedScreen
                orderdetails={orderdetails}
                onClick={async() =>{
                  const res = await this.getAllOrderedProducts(loggedInUserDetails, orderdetails)
                  this.setState({ orderedproducts: res });
                  this.setState({ activeStepBuy: this.state.activeStepBuy + 1 })
                }}
              />
            ),
          },
          {
            label: "PI Raised",
            component: (
              <Grid container className="align-center">
                <Grid item xs={12} md={4} lg={4}>
                  <div className="card-container no-hover">
                    {/* <div className="head-title padding-6 ">Proforma Invoice</div> */}
                    <Typography variant="h5">Proforma Invoice</Typography>
                    <div className="invoice-date padding-6">
                      <div>
                        {" "}
                        <span className="description-text">
                          Invoice No -{" "}
                        </span>{" "}
                        {orderdetails && orderdetails.ordernumber}
                      </div>
                      <div>
                        {" "}
                        <span className="description-text">{" "}
                          Date of Issue -
                        </span>{" "}
                        10/02/2020
                      </div>
                    </div>
                    <div className="padding-6 invoice-add">
                      {" "}
                      <span className = "description-text">
                        Billed to -
                      </span>{" "}
                      {orderdetails && orderdetails.billingstreet} {orderdetails && orderdetails.billingcity} {orderdetails && orderdetails.billingpostalcode} {orderdetails && orderdetails.billingstate} {orderdetails && orderdetails.billingcountry}
                    </div>
                    <div className="invoice-table">
                      <div className="table-heads">
                        {invoiceData.billHeads.map((name, index) => (
                          <div key={index} className="heading">
                            {name}
                          </div>
                        ))}
                      </div>
                      <div className="table-data">
                        {orderedproducts && orderedproducts.map((p, index) => ( 
                          <div key={index} className="data-inner">
                            <div className="data">{p.prd_name__c}</div>
                            <div className="data">{p.unitprice}</div>
                            <div className="data">{p.quantity}</div>
                            <div className="data">{p.totalprice}</div>
                          </div>
                        ))}
                      </div>
                      <div className="bill-total">
                        <div>
                          <span className="description-text">Sub Total:</span>
                          {orderedproducts && orderedproducts.reduce(
                            (s, a) => Number(a.totalprice)+ s,
                            0
                          )}
                        </div>
                        <div>
                          <span className="description-text">Tax - 18% -</span>
                          {(orderedproducts && orderedproducts.reduce(
                            (s, a) => Number(a.totalprice) + s,
                            0
                          ) /
                            100) *
                            18}
                        </div>
                        <div className="invoice-total">
                          {" "}
                          <span className="description-text">
                            Invoice Total -
                          </span>
                          {orderedproducts && orderedproducts.reduce(
                            (s, a) => Number(a.totalprice) + s,
                            0
                          ) +
                            (orderedproducts && orderedproducts.reduce(
                              (s, a) => Number(a.totalprice) + s,
                              0
                            ) /
                              100) *
                              18}
                        </div>
                      </div>
                    </div>{" "}
                    <div className="align-center padding-6">
                      <Button
                        onClick={() =>
                          this.setState({
                            activeStepBuy: this.state.activeStepBuy + 1,
                          })
                        }
                        variant="contained"
                        color="primary"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </Grid>
              </Grid>
            ),
          },
          {
            label: "Payment Details",
            component: (
              <PaymentDetailsScreen
                orderdetails={orderdetails}
                onClick={(details) =>{
                  this.UpdateAnOrder(loggedInUserDetails, orderdetails, details)
                  this.setState({ activeStepBuy: this.state.activeStepBuy + 1 })
                }}
                history= {this.props.history}
              />
            ),
          },
          {
            label: "Dispatched",
            component: (
              <DispatchedScreen
                orderdetails={orderdetails}
                onClick={() =>
                  this.setState({ activeStepBuy: this.state.activeStepBuy + 1,})
                }
              />
            ),
          },
          { label: "GRN", 
            component: 
            <RenderForm label="Confirm" type="buy" 
              orderdetails={orderdetails}
              orderedproducts={orderedproducts}
              onClick={() => {
                this.setState({activeStepBuy: this.state.activeStepBuy + 1});
                this.props.history.goBack();
              }} 
            />
            // this.renderForm("Add", "buy") ,
        }
        ]}
      ></Stepper>
    );
  };

  public renderSellStepper = ( ) => {
    const { orderedproducts, orderdetails } = this.state;
    console.log("this.state: ", this.state)
    return (
      <Stepper
        identifier="sell"
        activeStep={this.state.activeStepSell}
        onChangeStep={ (index) =>  this.setState({ activeStepSell: index })}
        stepData={[
          {
            label: "Draft",
            component: 
            <RenderForm label="Submit" type="sell" 
              orderedproducts={orderedproducts}
              orderdetails={orderdetails}
              onClick={( selectedProducts ) => {
                this.InsertUpdateItems(loggedInUserDetails, orderdetails, selectedProducts );
                this.setState({ activeStepSell: this.state.activeStepSell + 1 });
              }}
              onSelectDelaer={(details) => this.UpdateAnOrder(loggedInUserDetails, orderdetails, details)}
              history={this.props.history}
            />
            // this.renderForm("Submit", "sell"),
          },
          {
            label: "Submitted",
            component: (
              <SubmittedScreen
                orderdetails={orderdetails}
                onClick={async() =>{
                  const res = await this.getAllOrderedProducts(loggedInUserDetails, orderdetails)
                  this.setState({ orderedproducts: res });
                  this.setState({ activeStepSell: this.state.activeStepSell + 1 })
                }}
              />
            ),
          },
          {
            label: "Payment Details",
            component: (
              <PaymentDetailsScreen
                orderdetails={orderdetails}
                onClick={(details) =>{
                  this.UpdateAnOrder(loggedInUserDetails, orderdetails, details)
                  this.setState({ activeStepSell: this.state.activeStepSell + 1 })
                }}
              />
            ),
          },
          {
            label: "Dispatched",
            component: (
              <DispatchedScreen
                orderdetails={orderdetails}
                onClick={() => {
                  this.props.history.goBack();
                  this.setState({ activeStepSell: this.state.activeStepSell, });
                }}
              />
            ),
          },
        ]}
      />
    );
  };

  render() {
    console.log("this.props: ",this.props);
    const { orderedproducts, orderdetails } = this.state;

    return (
      <AppBar>
        {isDealer() ? (
          this.renderStepper()
          ) : (
          this.props.location.orderType === "Buy" ?
            this.renderStepper()
          : this.renderSellStepper() 
          )
        }
      </AppBar>
    );
  }
}
export function mapStateToProps(state) {
  return {};
}
export const AddNewOrder = connect<{}, {}, IAddNewOrderProps>(mapStateToProps)(
  AddNewOrderImpl
);

class RenderForm extends React.Component <any> {
  constructor(props){
    super(props);
  }

  state = {
    orderedproducts: this.props.orderedproducts && this.props.orderedproducts.length > 0 
      ? this.props.orderedproducts.map((p ,i)=> {return({sfid: "", label: p.prd_name__c, quantity: p.quantity, itemNumber: p.orderitemnumber})} )
      : [{sfid: "", label: "", quantity: "1"}, {sfid: "", label: "", quantity: "1"}, {sfid: "", label: "", quantity: "1"}, {sfid: "", label: "", quantity: "1"}],
    allProducts: [],
    selectedDealer: this.props.orderdetails && this.props.orderdetails.dealername__c,
    allDealers: [],
  };

  async componentDidMount(){
    loggedInUserDetails = getToken().data;
    const allProducts = await this.getAllProducts(loggedInUserDetails); 
    const allDealers = await this.getAllAssignedDealers(loggedInUserDetails);
    this.setState({ allProducts, allDealers });
    console.log("this.State =>", this.state);
  }

  getAllAssignedDealers = async (data) => {
    console.log("data: ",data);
    try {
        const assignedDealerData = await getData({
          query: `SELECT * FROM 
          salesforce.Account WHERE Assigned_Distributor__c = '${data.sfid}'`,
          token: data.token
        })

        console.log("assignedDealerData =>", assignedDealerData);
        return assignedDealerData.result;
        
    } catch (e) {
        console.log('fetch Inventory Error', e)
    }
  }
  getAllProducts = async (data) => {
    console.log("data: ", data)
    try {
        const products = await getData({
          query: `SELECT StockKeepingUnit, sfid FROM salesforce.product2 
          WHERE StockKeepingUnit is NOT NULL `,
          token: data.token
        })
        console.log("products =>", products);
        return products.result;
        
    } catch (e) {
        console.log('fetch Inventory Error', e)
    }
  }

  handleChange = (event: any, index: number) => {
    console.log("event: ", event, "index: ", index);
    const arr = this.state.orderedproducts.filter((item, i) => i === index )
      if(arr.length !== 0 ){
        const val = this.state.orderedproducts;
        val[index].label = event.label;
        val[index].sfid = event.value;
        this.setState({ orderedproducts: val})
      }
    
    // this.setState({
    //   [key]: value as any,
    // });
    console.log(this.state.orderedproducts);
  };

  renderValueManipulator = (key, i) => (
    <div className="increaser" >
      <div 
        onClick={() => {
          var val = this.state.orderedproducts;
          console.log(val[i].quantity)
          val[i].quantity = Number(val[i].quantity) - 1;
          this.setState({ orderedproducts: val});
          console.log(this.state.orderedproducts);
          // this.setState({ [key]: this.state[key] + 1 })
        }}
        className="plus hover"
      >
        -
      </div>
      <div className="value">
        {this.state.orderedproducts[i].quantity}
        {/* {this.state[key]} */}
      </div>
      <div
        onClick={() => {
          var val = this.state.orderedproducts;
          val[i].quantity = Number(val[i].quantity) + 1;
          this.setState({ orderedproducts: val})
          // this.setState({ [key]: this.state[key] + 1 })
        }}
        className="minus hover"
      >
        +
      </div>
    </div>
  );

  renderAddProduct = (item, i) => {
    return(
      <div className="product-selection">
        <Grid item xs={4} md={6} sm={6}>
          <Select
            className="r-select"
            classNamePrefix="r-select-pre"
            placeholder="Select"
            value={this.state.orderedproducts[i].label !== "" && this.state.orderedproducts[i]}
            options={this.state.allProducts.map(p => ({
              label: p.stockkeepingunit,
              value: p.sfid
            }))}
            onChange={(event: any) => this.handleChange(event, i)}
            isSearchable={false}
          />{" "}
        </Grid>
        <Grid item xs={4} md={4} sm={4}>
          {this.renderValueManipulator(item, i)}
        </Grid>
      </div>
    )
  }

  onClickChng =() => {
    var val = this.state.orderedproducts;
    val.push({sfid: "", label: "", quantity: "1"});
    this.setState({ orderedproducts: val})
  }
  
  render(){
    console.log(this.props);
    console.log(this.state);

    return(
      <div className="card-container no-hover">
        {!isDealer() && this.props.type === "sell"?
        <Grid container spacing={4}>
          <Grid item xs={12} md={12} sm={12}>
            <Select 
              className="r-select"
              classNamePrefix="r-select-pre"
              placeholder="Select Dealer"
              options={this.state.allDealers.map(p => ({
                label: p.name,
                value: p.sfid
              }))}
              value={this.state.selectedDealer && {label: this.state.selectedDealer}}
              onChange={(e)=> {
                this.setState({ selectedDealer: e.label });
                this.props.onSelectDelaer( e.value );
              }}
              // id="combo-box-demo"
              // blurOnSelect={true}
              // getOptionLabel={option => option.label}
              // renderInput={params => (
              //   <TextField {...params} label="Select Dealer" variant="outlined" />
              // )}
            />
          </Grid>
        </Grid>
        : null}
        {this.state.orderedproducts.map((item, i) => (
            <Grid container spacing={4}>
                {this.renderAddProduct(item, i)}
            </Grid>
          ))}
        {this.props.label !== "Confirm" ?
          <Grid container spacing={4}>
            <Grid item xs={6} md={6} sm={6}></Grid>
              <Grid item xs={6} md={6} sm={6}>
                <Button onClick={this.onClickChng} variant="contained" color="primary" >                
                    ADD PRODUCT
                </Button>
            </Grid>
          </Grid>
        : null}

        {this.props.label !== "Confirm" ?
          <div className="button-container">
            <Button variant="contained" color="default"
            onClick={() => this.props.history.goBack() }>
              Cancel
            </Button>
            <Button 
              onClick={() => this.props.onClick( this.state.orderedproducts)}
              variant="contained"
              color="primary"
            >
              {this.props.label}
            </Button>
          </div>
        :
          <div className="align-center padding-6" style={{marginTop: 25}}>
            <Button variant="contained" color="primary"
              onClick={() => this.props.onClick( this.state.orderedproducts)}
            >
              {this.props.label}
            </Button>
          </div>
        }
      </div>
    );
  }
}

class DispatchedScreen extends React.Component <any> {
  constructor(props){
    super(props);
  }

  state={
    details: [],
  }

  async componentDidMount(){
    console.log("this.props: ", this.props.orderdetails)
    const res = await this.getOrderDetails(loggedInUserDetails, this.props.orderdetails);
    this.setState({ details: res })
  }

  getOrderDetails = async (data, details) => {
    console.log("data: ", data);
    try {
        const orderedproducts = await getData({
          query: `select * from salesforce.order where id = '${details.id}'`,
          token: data.token
        })
        console.log("orderedproducts =>", orderedproducts);
        return orderedproducts.result;

    } catch (e) {
      console.log('fetch Inventory Error', e)
    }
  }

  render(){
    console.log("props: ", this.props)
    const details = this.state.details && this.state.details[0];
    return (
      <div style={{ width: "100%" }} className="card-container dispatch-card">
        <Typography variant="h5">Dispatched</Typography>
        <Grid container className="">
          <Grid item className="padding-6" md={6} xs={12} lg={6}>
            <span className="description-text">Order ID -</span>
            <span className="disp-details"> {details && details.ordernumber}</span>
          </Grid>
          <Grid item className="padding-6" md={6} xs={12} lg={6}>
            <span className="description-text">Order Date:</span>
            <span className="disp-details"> {details && details.effectivedate && moment(details.effectivedate).format("DD/MM/YYYY")}</span>
          </Grid>
        </Grid>
        <Grid container className="">
          <Grid item className="padding-6" md={6} xs={12} lg={6}>
            <span className="description-text">Total Items -</span>
            <span className="disp-details"> {details && details.product_quantity__c}</span>
          </Grid>
          <Grid item className="padding-6" md={6} xs={12} lg={6}>
            <span className="description-text">Order Total:</span>
            <span className="disp-details"> {details && details.totalamount}</span>
          </Grid>
        </Grid>
        <Grid container className="">
          <Grid item className="padding-6" md={6} xs={12} lg={6}>
            <span className="description-text">Courier Name -</span>
            <span className="disp-details"> {details && details.courier_name__c}</span>
            {/* <div className="disp-details"> */}
          </Grid>
          <Grid item className="padding-6" md={6} xs={12} lg={6}>
              <span className="description-text">Consignment No. -</span>
              <span className="disp-details"> {details && details.Consignment_No__c}</span>
          </Grid>
            {/* </div>
            <div className="disp-details"> */}
          <Grid item className="padding-6" md={6} xs={12} lg={6}>
              <span className="description-text"> Shipping Date - </span>
              <span className="disp-details"> {details && details.Shipping_date__c && moment(details.Shipping_date__c).format("DD/MM/YYYY")}</span>
            {/* </div> */}
          </Grid>
        </Grid>{" "}
        <div className="align-center padding-6">
          <Button onClick={this.props.onClick} variant="contained" color="primary">
            Next
          </Button>
        </div>
      </div>
    );
  }
};

const PaymentDetailsScreen = (props) => {
  const details = props.orderdetails;
  const [paymentMode, setPaymentMode] = React.useState(details && details.payment_mode__c );
  const [paymentType, setPaymentType] = React.useState(details && details.payment_type__c );
  const [description, setDescription] = React.useState(details && details.description || "");
  
  // const paymentMode = details && { label: details && details.payment_mode__c};
  // const paymentType = details && { label: details && details.payment_type__c};

  return (
    <Grid container className="align-center">
      <Grid item xs={12} md={6} lg={6}>
        <div className="card-container no-hover payment-mode">
          {/* <div className="head-title">Payment Mode and Details</div> */}
          <Typography variant="h5">Payment Mode and Details</Typography>
          <div className="product-selection">
            <Select
              className="r-select"
              classNamePrefix="r-select-pre"
              placeholder="Select Payment Type" 
              value={paymentMode && {label: paymentMode}}
              onChange={(e) => setPaymentMode(e.label)}
              options={options}
              isSearchable={false}
            />
          </div>
          <div className="product-selection">
            <Select
              className="r-select"
              isSearchable={false}
              value={paymentType && {label: paymentType}}
              onChange={(e) => setPaymentType(e.label)}
              placeholder="Select Payment Method"
              options={options1}
            />
          </div>{" "}
          <div className="product-selection">
            <TextField
              id="filled-textarea"
              // label="Remarks"
              placeholder="Remarks"
              rows={4}
              variant="outlined"
              multiline={true}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="r-select"
            />
          </div>{" "}
          <div className="button-container">
            <Button variant="contained" color="default"
            onClick={() => props.history.goBack()}>
              Cancel
            </Button>
            <Button onClick={() => props.onClick({details: {paymentMode, paymentType, description}} )} variant="contained" color="primary">
              Submit
            </Button>
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

const SubmittedScreen = (props) => {
  const details = props.orderdetails || [];
  console.log(details)
  
  return (
    <div className="card-container">
      <Grid container={true}>
        <Grid item={true} className="padding-6" xs={12} md={6}>
          <span className="description-text"> Order ID -</span>
          {details.ordernumber || ""}
        </Grid>
        <Grid item={true} className="padding-6" xs={12} md={6}>
          <span className="description-text"> Order Date - </span>
          {details.effectivedate && moment(details.effectivedate).format("DD/MM/YYYY") || ""}
        </Grid>
        <Grid item={true} className="padding-6" xs={12} md={6}>
          <span className="description-text"> Items Quantity -</span>
          {details.item_quantity__c || ""}
        </Grid>
        <Grid item={true} className="padding-6" xs={12} md={6}>
          <span className="description-text">Total -</span>
          {details.totalamount || ""}
        </Grid>
      </Grid>
      <div className="align-center padding-6">
        <Button onClick={props.onClick} variant="contained" color="primary">
          Next
        </Button>
      </div>
    </div>
  );
};

//   <Tabs
//     tabsData={[
//       { tabName: "Buy", component: this.renderStepper() },
//       {
//         tabName: "Sell",
//         component: this.renderSellStepper(),
//       },
//     ]}
//   />
// )}
