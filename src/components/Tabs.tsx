import * as React from "react";
import "./resuableComponent.scss";
import Select from "react-select";
import InputLabel from '@material-ui/core/InputLabel';

export interface TabsProps {
  tabsData: any;
  onSortChange?: (value) => void;
  onChangeTabValue?: (value) => void;
  hasSort?: boolean;  isIndex?: number;
  sortValue?: (value) => void;
}

export class Tabs extends React.Component<
  TabsProps,
  { activeTabIndex: number; activeTab: any; selectValue: any;}
> {
  public state = { activeTabIndex: 0, activeTab: [], selectValue: [{name: "", label: ""}] };

  public handleTabChange = (tabData: any, index: number) => {
    this.setState({
      activeTab: tabData,
      activeTabIndex: index,
    });

    if(tabData.tabName === this.props.tabsData[0].tabName){
      this.props.tabsData.map(tab=> {
        tabData.tabName !== tab.tabName 
        ? tab.onChangeTabValue && tab.onChangeTabValue(null)
        : this.setState({selectValue: [{name: null, label: null}] })
      })
    }else if(tabData.tabName === "Product"){
      this.props.tabsData[2].onChangeTabValue(null)   
      const arr = this.state.selectValue.filter(item => 
        item.name === "Tank Capacity" ? (item.label = null, item.name = null) : null) 
    }
  };

  handleSortChange = (value) => {
    this.props.onSortChange && this.props.onSortChange(value);
  };

  handleDisable =() => {
    const arr = this.state.selectValue.filter(item => item.name === "Product")
    return arr && arr[0] && arr[0].label === "Tank" ? false : true
  };

  public render() {
    console.log("this.State=> ", this.state);
    console.log("this.props=> ", this.props);

    return (
      <React.Fragment>
        <div className="tabs-container">
          {this.props.tabsData.map((tab: any, index: any) => {
            return (
              <div
                className={`tab-button ${
                  index === this.state.activeTabIndex ? "active" : ""
                }`}
                key={index}
                onClick={() => {
                  tab.onTabSelect && tab.onTabSelect(tab.tabName);
                  this.handleTabChange(tab, index);
                }}
              > 
                {tab.options ?
                  tab.options.length > 0 ? 
                    <Select
                      // autoFocus={true}
                      // styles = {{option: (provided, state) => ({
                      //   ...provided,
                      //   color: state.isSelected ? 'white' : 'black',
                      //   backgroundColor: state.isSelected ? '#48a89c' : 'white',
                      // })}}
                      // id= 'demo-simple-select-filled'
                      // isMulti
                      isSearchable={true}
                      isDisabled={tab.tabName === "Tank Capacity" ?this.handleDisable(): false} 
                      // value={this.state.activeTab.tabName == tab.tabName ? this.state.selectValue : null}
                      value= {this.state.selectValue.filter(item => item.name === tab.tabName)}
                      onChange={(e) => {
                        tab.onChangeTabValue(e.value); 
                        const arr = this.state.selectValue.filter((item) => item.name === tab.tabName ? item.label = e.value : null)
                        if (arr.length === 0) {
                          this.state.selectValue.push({ name: tab.tabName, label: e.value })
                        }
                        // this.setState({selectValue: e})
                      }}
                      placeholder={<div style={{color: 'black'}}>{tab.tabName}</div>}
                      options= {tab.options}
                    />
                  :
                      <input className="tab-input"
                        disabled={true}
                        value= {tab.tabName}
                      />
                : 
                  <input className="tab-input" 
                    style={{width: '170px', height: '34px'}}
                    disabled={true}
                    value= {tab.tabName}
                  /> 
                }
              </div>
            );
          })}

          {this.props.hasSort && (
            <div className="tab-button">
            <Select
              onChange={(e)=> this.props.sortValue(e.value)}
              placeholder={<div style={{color: 'black'}}>Sort</div>}
              isSearchable={false}
              options={[
                { label: "Assending", value: "asc" },
                { label: "Descending", value: "dsc" },
              ]}
            />
            </div>
          )}
          
        </div>
        {
          this.props.tabsData.find(
            (tab: any, index: any) => index === this.state.activeTabIndex
          ).component
        }
      </React.Fragment>
    );
  }
}
const customStyles = {
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? 'white' : 'black',
    backgroundColor: state.isSelected ? '#48a89c' : 'white',
    hover: {
      cursor: 'pointer',
      backgroundColor: '#48a89c',
      // color:white;
      // color:'black'
  }
  }),
  control: (provided, state) => ({
    ...provided,
    color: 'white',
    // backgroundColor: '#48a89c',
    border: '#48a89c'
  })
}