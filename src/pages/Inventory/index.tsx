import { Grid, Button } from "@material-ui/core";
import * as React from "react";
import { connect } from "react-redux";
import moment from 'moment';
import { BaseModal } from "src/components/BaseModal";
import { Tabs } from "src/components/Tabs";
import { Loading, NotFoundError } from "src/components/Loading";
import AppBar from "src/navigation/App.Bar";
import getData from "src/utils/getData";
import data from "../../data";
import { getToken, isDealer } from "src/state/Utility";
import "./inventory.scss";
import Typography from "material-ui/styles/typography";

const productsFilterOptions = (invdata) => [
  {label: "3W ACE ( "+ invdata.filter( inv =>  inv.family === "3 Wheeler Ace" ).length +" )", value: "3 Wheeler Ace"},
  {label: "3W Pro ( "+ invdata.filter( inv =>  inv.family === "3 Wheeler Pro" ).length +" )", value: "3 Wheeler Pro"},
  {label: "4W Ace ( "+ invdata.filter( inv =>  inv.family === "4 Wheeler Ace" ).length +" )", value: "4 Wheeler Ace"},
  {label: "4W Pro ( "+ invdata.filter( inv =>  inv.family === "4 Wheeler Pro" ).length +" )", value: "4 Wheeler Pro"},
  {label: "Tank ( "+ invdata.filter( inv =>  inv.family === "Tank" ).length +" )", value: "Tank"},
  {label: "Spare ( "+ invdata.filter( inv =>  inv.family === "Spare" ).length +" )", value: "Spare"},
];

const tankFilterOptions = (invdata)=>[
  {label: "30 ( "+ invdata.filter( inv =>  inv.tank_capacity__c === "30" ).length +" )", value: "30"},
  {label: "35 ( "+ invdata.filter( inv =>  inv.tank_capacity__c === "35" ).length +" )", value: "35"},
  {label: "60 ( "+ invdata.filter( inv =>  inv.tank_capacity__c === "60" ).length +" )", value: "60"},
  {label: "65 ( "+ invdata.filter( inv =>  inv.tank_capacity__c === "65" ).length +" )", value: "65"},
  {label: "70 ( "+ invdata.filter( inv =>  inv.tank_capacity__c === "70" ).length +" )", value: "70"},
  {label: "75 ( "+ invdata.filter( inv =>  inv.tank_capacity__c === "75" ).length +" )", value: "75"},
  {label: "90 ( "+ invdata.filter( inv =>  inv.tank_capacity__c === "90" ).length +" )", value: "90"},
]
var filterLength;
export interface IInventoryProps {location?: any;}

export class InventoryImpl extends React.PureComponent<
  IInventoryProps,
  { currentItem: any; 
    openEditModal: boolean;
     data: any;
     isFilterOpen: boolean;
     filterType: string;
     selectedProductFilter: string;
     selectedTankFilter: string;
     sortType: string;
  }
> {
  constructor(props: IInventoryProps) {
    super(props);
    this.state = {
      currentItem: null,
      openEditModal: false,
      data: null,
      isFilterOpen: false,
      filterType: "",
      selectedProductFilter: "",
      selectedTankFilter: "",
      sortType: "",
    };
  };

  async componentDidMount(){

    const {data} = getToken();
    const {location} = this.props;
    const sfid = location.data && location.data.sfid ? location.data.sfid : data.sfid;
    const recordtypeid = location.data && location.data.recordtypeid ? location.data.recordtypeid : data.record_type;
    const res = await this.getAllInventoryData(data.token, sfid, recordtypeid );
    console.log("result ", res)
    this.setState({data : res});
  }

  getAllInventoryData = async (token, sfid, recordtypeid) => {
    // console.log("token: ",token);
    // console.log("sfid: ",sfid);
    // console.log("recordtypeid: ",recordtypeid);
    let inventoryData;
    try {
      if(recordtypeid === "0122w000000cwfSAAQ"){
        inventoryData = await getData({
          query: `SELECT CreatedDate, Date_Purchased__c, Description, Family, Id, image_url__c, 
          Manufacture_date__c, Name, ProductCode, Sold_To_Customer__c, Sold_To_Dealer__c, 
          Sold_To_Distributor__c, StockKeepingUnit, Tank_Capacity__c, Tank_Id__c, Customer_Name__c, Dealer_Name__c
          FROM salesforce.product2 WHERE sold_to_dealer__c = '${sfid}'`,
          token: token
        })
      }else if(recordtypeid === "0122w000000cwfNAAQ"){
        inventoryData = await getData({
          query: `SELECT CreatedDate, Date_Purchased__c, Description, Family, Id, image_url__c, 
            Manufacture_date__c, Name, ProductCode, Sold_To_Customer__c, Sold_To_Dealer__c, 
            Sold_To_Distributor__c, StockKeepingUnit, Tank_Capacity__c, Tank_Id__c, Customer_Name__c, Dealer_Name__c
            FROM salesforce.product2 WHERE sold_to_distributor__c ='${sfid}'`,
          token: token
        })
      }
        console.log("inventoryData =>", inventoryData);
        return inventoryData.result;
        
    } catch (e) {
        console.log('fetch Inventory Error', e)
    }
  }

  public renderModal = () => {
    const { currentItem, data } = this.state;
    if (!currentItem) {
      return ;
    }
    const dataToDisplay = [
      { label: "Product Name", value: currentItem.family },
      { label: "SKU", value: currentItem.stockkeepingunit },
      { label: "Manf. Date", value: currentItem.manufacture_date__c },
      // { label: "Tank ID", value: currentItem.tank_id__c },
      // { label: "Tank Capacity", value: currentItem.tank_capacity__c },
    ];
    return (
      <BaseModal
        open={this.state.openEditModal}
        className="inventory-modal"
        contentClassName="inventory-modal"
        onClose={() => this.setState({ openEditModal: false })}
      >
        <Grid container spacing={1} className="">
          <Grid item className="modal-margin" xs={12} md={12}>
            <div style={{marginTop: '-30px'}}>
              <img src={currentItem.image_url__c} height="200px" alt="dta" className="inv-image"/>
              {/* <div className="description-text">Product Images</div> */}
            </div>
            <div className="text-left">
              <div className="head">
                <b> Product Details</b>
                <hr />
              </div>
              {dataToDisplay.map((data) => (
                <Grid container style={{padding:'5px'}}>
                  <Grid item xs={6} md={6} className="grid-label">
                    <span className="description-text">{data.label}</span>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    {data.value}
                  </Grid>
                </Grid>
              ))}
            </div>
          </Grid>
        </Grid>
      </BaseModal>
    );
  };

  public handleItemClick = (itemData: any) => {
    this.setState({
      currentItem: itemData,
      openEditModal: true,
    });
  };

  public renderFilterModel = () => {
    return(
      <BaseModal
        className="assign-dealer-modal"
        contentClassName="support-content"
        onClose={() => this.setState({ isFilterOpen: false })}
        open={this.state.isFilterOpen}
      >
         <div className="head-title">Filters</div>
        <form className="form-content" autoComplete="off">
          <div className="dealer-name-container">
            {this.state.filterType === "Product Type" ?
              productsFilterOptions.map((fData, index) => (
                <div
                  key={index}
                  onClick={() =>
                    this.setState({
                      selectedProductFilter: fData.label,
                    })
                  }
                  className={`dealer-name ${
                    this.state.selectedProductFilter === fData.label && "active"
                  }`}
                >
                  {fData.label}
                </div>
              ))
            : null }
            {this.state.filterType === "Tank Capacity" ?
              tankFilterOptions.map((fData, index) => (
                <div
                  key={index}
                  onClick={() =>
                    this.setState({
                      selectedTankFilter: fData.label,
                    })
                  }
                  className={`dealer-name ${
                    this.state.selectedTankFilter === fData.label && "active"
                  }`}
                >
                  {fData.label}
                </div>
              ))
            : null }
          </div>

          <div className="button-container">
            <Button
              onClick={() => this.setState({ isFilterOpen: false })}
              variant="contained"
              color="default"
            >
              Cancel
            </Button>{" "}
            <Button
              onClick={() => this.setState({ isFilterOpen: false })}
              variant="contained"
              color="primary"
            >
              Apply
            </Button>
          </div>
        </form>
      </BaseModal>
    )
  }

  public render() {
    var invdata ;
    if(this.state.sortType === "asc"){ 
      invdata = this.state.data.sort((a,b) => new Date(a.date_purchased__c) - new Date(b.date_purchased__c))}
    else if(this.state.sortType === "dsc"){
      invdata = this.state.data.sort((a,b) => new Date(b.date_purchased__c) - new Date(a.date_purchased__c) )
    }
    else{
      invdata = this.state.data
    }
  
    console.log("this.state.selectedTankFilter: ", this.state.selectedTankFilter)
    console.log("this.state.selectedProductFilter: ", this.state.selectedProductFilter)
    return (
      <AppBar>
        {this.renderModal()}
        {/* {this.renderFilterModel()} */}
        { this.state.data === null
          ? <Loading />
          : ( this.state.data.length === 0)
              ? <NotFoundError />
              : <Tabs 
                    hasSort={true} 
                    sortValue={(sortVal) => this.setState({sortType: sortVal})}
                    tabsData={ [
                      { tabName: "All ( "+ invdata.length +" )",
                        options: [],
                        component: ( 
                          <div className="inventory-container">
                            { invdata.map((inData) => {
                              return(              
                                // <Grid item xs={12} md={6}>
                                  <InventoryCards
                                    onClickItem={this.handleItemClick}
                                    data={inData}
                                  />
                              // </Grid>
                              )
                            })
                          }
                          </div>
                        ),
                        onTabSelect: (tabname) => this.setState({ selectedProductFilter: "", selectedTankFilter: ""}),
                      },
                      { tabName: "Product",
                        options: productsFilterOptions(invdata),
                        component: (
                          <div className="inventory-container">
                          {
                            (this.state.selectedTankFilter !== null ? 
                            invdata.filter( inv => inv.family === "Tank" && inv.tank_capacity__c === this.state.selectedTankFilter ).length > 0 :
                            invdata.filter( inv => inv.family === this.state.selectedProductFilter ).length > 0 )
                            ?
                              invdata.map((inData) => {
                                if(this.state.selectedTankFilter !== null){    
                                  console.log("Filter length: ", invdata.filter( inv => inv.family === "Tank" && inv.tank_capacity__c === this.state.selectedTankFilter).length)                              
                                  if(inData.family === this.state.selectedProductFilter && inData.tank_capacity__c === this.state.selectedTankFilter){
                                    return(              
                                      <InventoryCards
                                        onClickItem={this.handleItemClick}
                                        data={inData}
                                      />
                                    )
                                  }
                                }
                                else if(inData.family === this.state.selectedProductFilter){
                                   console.log("Product length: ", invdata.filter( inv => inv.family === this.state.selectedProductFilter ).length)
                                   return(              
                                    <InventoryCards
                                      onClickItem={this.handleItemClick}
                                      data={inData}
                                    />
                                  )
                                }
                              })
                            : <NotFoundError />
                          }
                          </div>
                        ),
                        onTabSelect: (tabname) => this.setState({ isFilterOpen: true, filterType: "Product Type"}),
                        onChangeTabValue : (tabValue) => this.setState({ selectedProductFilter: tabValue }),
                      },
                      { tabName: "Tank Capacity",
                        options: tankFilterOptions(invdata),
                        component: (
                          <div className="inventory-container">
                            { 
                             (this.state.selectedProductFilter !== "" ? 
                              invdata.filter( inv => inv.tank_capacity__c === this.state.selectedTankFilter && inv.family === "Tank" ).length > 0 :
                              invdata.filter( inv => inv.tank_capacity__c === this.state.selectedTankFilter ).length > 0 )
                              ?
                                invdata.map((inData) => {
                                  if(this.state.selectedProductFilter !== "" ){
                                    if(inData.tank_capacity__c === this.state.selectedTankFilter && inData.family === this.state.selectedProductFilter){
                                      // {console.log("Tank + Product")}
                                      return(
                                        <InventoryCards
                                          onClickItem={this.handleItemClick}
                                          data={inData}
                                        />
                                      )
                                    }
                                  }
                                  else {if(inData.tank_capacity__c === this.state.selectedTankFilter){
                                    // {console.log("tank")}
                                    return(              
                                      <InventoryCards
                                        onClickItem={this.handleItemClick}
                                        data={inData}
                                      />
                                    )
                                  }}
                                })
                              : <NotFoundError />
                            }
                          </div>
                        ),
                        onTabSelect: (tabName) => this.setState({ isFilterOpen: true, filterType: "Tank Capacity" }),
                        onChangeTabValue : (tabValue) => this.setState({ selectedTankFilter: tabValue }),
                      },
                    ]}  
                />
        }
        {/* <div className="inventory-container">
          <Grid container>
            <InventoryCards
              onClickItem={this.handleItemClick}
              data={this.state.data}
            />
          </Grid>
        </div> */}
      </AppBar>
    );
  }
}
export function mapStateToProps(state) {
  return {};
}
export const Inventory = connect<{}, {}, IInventoryProps>(mapStateToProps)(
  InventoryImpl
);

const InventoryCards = (props: any) => {
  const inData =  props.data;
  var date1 = new Date();
  var date2 = new Date(inData.date_purchased__c);
  var diffinMonths = date1.getMonth() - date2.getMonth();
  var diffinDays = (date1.getDate() - date2.getDate()) + (30 * diffinMonths);

  // return props.data.map((inData: any, key: string) => {
    return (
      <Grid item xs={12} md={4} lg={4}>
        <div
          onClick={() => props.onClickItem(inData)}
          // key={key}
          className="card-container"
        >
          <div className="inventory-card">
            {" "}
            <div>
              <img
                src={inData.image_url__c}
                width="80px"
                alt="bike"
                className="inv-image"
              />
            </div>
            <div className="text-left">
              <div className="padding-6">
                {" "}
                <span className="description-text">Model - </span> {inData.name}
              </div>
              {/* <div className="padding-6">
                <span className="description-text">Price - </span>
                {inData.price}
              </div>{" "} */}
              <div className="padding-6">
                <span className="description-text">Inventory Aging - </span>
                {diffinDays < 0 ? -diffinDays : diffinDays} days
              </div>
              <div className="padding-6">
                <span className="description-text">
                  {" "}
                  Added to Inventory on -{" "}
                </span>
                {moment(inData.date_purchased__c).format("DD/MM/YYYY")}
              </div>
              {isDealer() ?
                inData.customer_name__c ? 
                  <div className="padding-6">
                    <span className="description-text">Sold to Customer -</span>
                    {inData.customer_name__c}
                  </div>
                : 
                  <div className="padding-6">
                    <span className="description-text"></span>
                  </div>
              :
                inData.dealer_name__c ?
                  <div className="padding-6">
                    <span className="description-text">Sold to Dealer -</span>
                    {inData.dealer_name__c}
                  </div>
                : 
                <div className="padding-6">
                  <span className="description-text"></span>
                </div>
              }
            </div>
          </div>
        </div>
      </Grid>
    );
  // });
};
