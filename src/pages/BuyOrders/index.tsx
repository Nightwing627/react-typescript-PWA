import * as React from "react";
import { connect } from "react-redux";
import AppBar from "src/navigation/App.Bar";
import "./buyOrders.scss";
import { withRouter } from "react-router-dom";
import { IHistory, isDealer } from "src/state/Utility";
import { Fab } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import moment from 'moment';
import { Tabs } from "src/components/Tabs";
import TrakingInfoBar from "src/components/TrakingInfoBar";
import { getToken } from "src/state/Utility";
import getData from "src/utils/getData";
import { saveOrderData } from "src/actions/App.Actions";
import { dark } from "@material-ui/core/styles/createPalette";
import { getDefaultSettings } from "http2";

var loggedInUserDetails;
export interface IBuyOrdersProps {
  data?: string;
  history: IHistory;
}

export class BuyOrdersImpl extends React.PureComponent<IBuyOrdersProps, any> {
  constructor(props: IBuyOrdersProps) {
    super(props);
    this.state = {
      value: "",
      topActiveTab: "Buy",
      orders: [],
    };
  }

  async componentDidMount(){
    loggedInUserDetails = getToken().data;
    const res = await this.getAllOrders(loggedInUserDetails);
    console.log("result ", res)
    this.setState({orders : res});
  }

  getAllOrders = async (data) => {
    console.log("token: ",data);
    // console.log("sfid: ",sfid);
    // console.log("recordtypeid: ",recordtypeid);
    let orders;
    try {
      if(data.record_type === "0122w000000cwfSAAQ"){
        orders = await getData({
          query: `SELECT * FROM salesforce.order NATURAL FULL JOIN salesforce.orderItem 
          WHERE salesforce.Order.Sold_To_Dealer__c LIKE '%${data.sfid}%' AND sfid is NOT NULL`,
          token: data.token
        })
      }else if(data.record_type === "0122w000000cwfNAAQ"){
        orders = await getData({
          query: `SELECT * FROM salesforce.order 
          WHERE salesforce.order.accountid = '${data.sfid}' AND sfid is NOT NULL `,
          token: data.token
        })
      }
      // (salesforce.Order.RecordTypeId = '0122w000000UJdmAAG' || salesforce.Order.RecordTypeId = '0122w000000UJe1AAG' )
        console.log("orders =>", orders);
        return orders.result;
        
    } catch (e) {
        console.log('fetch Inventory Error', e)
    }
  }

  getAllOrderedProducts = async (data, product2ID) => {
    console.log(product2ID);
    console.log("data: ", data);
    try {
        const orderedproducts = await getData({
          query: `select * from salesforce.orderitem where orderid = '${product2ID}'`,
          token: data.token
        })
        console.log("orderedproducts =>", orderedproducts);
        return orderedproducts.result;

    } catch (e) {
      console.log('fetch Inventory Error', e)
    }
  }

  InsertNewOrder = async (data, orderType) => {
    console.log("data: ", data);
    console.log(new Date())
    const order = orderType === "Buy" ? '0122w000000UJdmAAG' : '0122w000000UJe1AAG';
    let insertRTO;
    try{
      if(data.record_type === "0122w000000cwfSAAQ"){
        
        const SFID = await getData({
          query: `select Assigned_distributor__c from salesforce.account where sfid = '${data.sfid}'`,
          token : data.token
        })
        console.log("SFID: ", SFID)
        insertRTO = await getData({
          query: `INSERT INTO salesforce.order
          (status, EffectiveDate, Pricebook2Id, recordtypeid, Sold_To_Dealer__c, AccountId)
          values
          ('Ordered', '${moment(new Date()).format("MM/DD/YYYY")}', '01s2w000003BsOZAA0','0122w000000UJe1AAG','${data.sfid}', '${SFID.result[0].assigned_distributor__c}' )
          RETURNING Id`,
          token: data.token
        });
      }
      else if(data.record_type === "0122w000000cwfNAAQ"){
        if(orderType === "Buy"){
          insertRTO = await getData({
            query: `INSERT INTO salesforce.order
            (status, EffectiveDate, Pricebook2Id, accountid, recordtypeid)
            values
            ('Ordered', '${moment(new Date()).format("MM/DD/YYYY")}', '01s2w000003BsOZAA0', '${data.sfid}', '0122w000000UJdmAAG')
            RETURNING Id`,
            token: data.token
          });
        }
        else{
          insertRTO = await getData({
            query: `INSERT INTO salesforce.order
            (status, EffectiveDate, Pricebook2Id, accountid, recordtypeid)
            values
            ('Ordered', '${moment(new Date()).format("MM/DD/YYYY")}', '01s2w000003BsOZAA0', '${data.sfid}', '0122w000000UJe1AAG' )
            RETURNING Id`,
            token: data.token
          });
        }
      }

      console.log("insertRTO => ", insertRTO);
      return insertRTO.result[0];
    }
    catch(e){
      console.log(e);
    }
  }

  handleClickDetails = async (orderData) => {
    console.log(orderData)
    const products = await this.getAllOrderedProducts(loggedInUserDetails, orderData.sfid);
    console.log("products: ", products);
    this.props.history.push({pathname: "/buy-order/add-new-order", 
        orderType: this.state.topActiveTab, orderdetails: orderData, orderedproducts: products});
  }

  public renderCard = (orderData) => {
    return (
      <div className="cards-main">
        {orderData.map((dataValue: any, index: number) => {
          return (
            <div key={index} className="card-container">
              <div className="card-content">
                <div className="row-data">
                  <div className="data-content">
                    <span className="description-text"> Order ID: </span>
                    {dataValue.ordernumber}{" "}
                  </div>
                  <div className="data-content">
                    <span className="description-text"> Order Date: </span>
                    {moment(dataValue.effectivedate).format("DD/MM/YYYY")}{" "}
                  </div>
                </div>
                <div className="row-data">
                  <div className="data-content">
                    <span className="description-text">Total Items:</span>
                    {dataValue.product_quantity__c}{" "}
                  </div>
                  <div className="data-content">
                    <span className="description-text">Total Price:</span> 
                    {dataValue.totalamount}{" "}
                  </div>
                </div>
                <div className="row-data">
                  <div className="data-content">
                    <span className="description-text"> Order Status:</span> 
                    {dataValue.status}{" "}
                  </div>
                  <div className="data-content">
                    <span className="description-text"> Payment Mode:</span> 
                    {dataValue.payment_mode__c}{" "}
                  </div>
                </div>
                <div className="row-data">
                    {/* <span> */}
                      <TrakingInfoBar status={dataValue.status}/>
                    {/* </span> */}
                </div>
                <div className="row-data">
                  <div className="data-content">
                    <span
                      onClick={() => this.handleClickDetails(dataValue) }
                      className="view"
                    >
                    View Details
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  public render() {
    const orderData = this.state.orders.sort((a,b) => 
      // Number(a.casenumber.substr(a.casenumber.length - 3)) - Number(b.casenumber.substr(b.casenumber - 3))
      new Date(a.createddate) - new Date(b.createddate)
      )
    const buyOrders = orderData && orderData.filter(data => data.recordtypeid === "0122w000000UJdmAAG")
    const sellOrders = orderData && orderData.filter(data => data.recordtypeid === "0122w000000UJe1AAG")
    return (
      <AppBar>
         {isDealer() ? (
          this.renderCard(orderData)
        ) : (
          <Tabs
            tabsData={[
              { tabName: "Buy", 
                component: this.renderCard(buyOrders), 
                onTabSelect: (tabName) => this.setState({topActiveTab: tabName}) 
              },
              {
                tabName: "Sell",
                component: this.renderCard(sellOrders),
                onTabSelect: (tabName) => this.setState({topActiveTab: tabName})
              },
            ]}
          />
        )}
        <span
          style={{ position: "absolute", right: 20, bottom: 20 }}
          onClick={async () => {
            const res = await this.InsertNewOrder(loggedInUserDetails, this.state.topActiveTab);
            console.log("res: ", res)
            this.props.history.push({ pathname: "/buy-order/add-new-order", 
              orderdetails: res, orderType: this.state.topActiveTab })
          }}
        >
          <Fab color="secondary" aria-labelledby="add-ticket">
            <Add />
          </Fab>
        </span>
      </AppBar>
    );
  }
}
export function mapStateToProps() {
  return {};
}
export const BuyOrders = withRouter(
  connect<{}, {}, IBuyOrdersProps>(mapStateToProps)(BuyOrdersImpl) as any
);

const data = [
  {
    orderId: "ON-26541",
    orderDate: "10/05/2020",
    quantity: 20,
    totalPrice: "Rs.56485",
    orderStatus: "Draft",
    PaymentMode: "Upfront",
  },
  {
    orderId: "ON-26541",
    orderDate: "10/05/2020",
    quantity: 20,
    totalPrice: "Rs.56485",
    orderStatus: "Draft",
    PaymentMode: "Loan",
  },
  {
    orderId: "ON-26541",
    orderDate: "10/05/2020",
    quantity: 20,
    totalPrice: "Rs.56485",
    orderStatus: "Draft",
    PaymentMode: "Loan",
  },
  {
    orderId: "ON-26541",
    orderDate: "10/05/2020",
    quantity: 20,
    totalPrice: "Rs.56485",
    orderStatus: "Draft",
    PaymentMode: "Upfront",
  },
];
