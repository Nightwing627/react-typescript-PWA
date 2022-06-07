import { Theme, withStyles } from "@material-ui/core";
import { Assessment } from "@material-ui/icons";
import * as React from "react";
import { BaseModal } from "src/components/BaseModal";
import AppBar from "src/navigation/App.Bar";
import { TableWithGrid } from "../components/TableWithGrid";
import data from "../data";
import { isDealer } from "src/state/Utility";
interface IPageState {
  usersTablePage?: number;
  usersTableRowsPerPage: number;
  showStatsModal: boolean;
}

class HomePageImpl extends React.Component<{ classes: any }, {}> {
  public state: IPageState = {
    usersTablePage: 0,
    usersTableRowsPerPage: 5,
    showStatsModal: this.props.location.showStatsModal ? this.props.location.showStatsModal : false ,
  };

  leadStatus = [
    {
      label: "Stages",
      name: "stages",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      label: "Count",
      name: "count",
      options: {
        filter: true,
        sort: false,
      },
    },
  ];

  storeStatus = [
    {
      label: "Stores",
      name: "stores",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      label: "Count",
      name: "count",
      options: {
        filter: true,
        sort: false,
      },
    },
  ];

  leadData = [
    {
      stages: "New",
      count: 50,
    },
    {
      stages: "Negotiating",
      count: 100,
    },
    {
      stages: "Converted",
      count: 100,
    },
  ];

  leadCustomerData = [
    {
      stages: "New",
      count: 50,
    },
    {
      stages: "Unassigned",
      count: 100,
    },
  ];

  leadDealerData = [
    {
      stages: "New",
      count: 50,
    },
    {
      stages: "Converted",
      count: 100,
    },
  ];

  storeData = [
    {
      stores: "Operational Stores",
      count: 3,
    },
    {
      stores: "Pending Stores",
      count: 3,
    },
  ];

  public render(): JSX.Element {
    const { classes } = this.props;
    const columns = [
      {
        name: "product",
        label: "Product",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "target",
        label: "Target",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "achieved",
        label: "Achieved",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "target_left",
        label: "Target Left",
        options: {
          filter: true,
          sort: false,
        },
      },
    ];
    const options = {
      filterType: "checkbox",
      responsive: "scrollMaxHeight",
    };
    console.log("props ",this.props)
    return (
      <AppBar
        sideButton={
          <div style={{ marginRight: "20px" }}>
            <Assessment
              onClick={() => this.setState({ showStatsModal: true })}
            />
          </div>
        }
      >
        <BaseModal
          className="assign-dealer-modal"
          onClose={() => this.setState({ showStatsModal: false })}
          contentClassName="support-content"
          open={this.state.showStatsModal}
        >
          <div style={{ height: "300px" }}>
            Today's Tasks / Pending Tasks
            <div style={{ padding: "30px" }}>No Task Added Today</div>
          </div>
        </BaseModal>
        <div className={classes.root + " home"}>
          
          <TableWithGrid
            title={"Monthly Sales Target"}
            data={data.sales.data}
            columns={columns}
            options={options as any}
          />
          {!isDealer() && (
            <TableWithGrid
              title={"Store Status"}
              data={this.storeData}
              columns={this.storeStatus}
              options={options as any}
            />
          )}
          {isDealer() && (
            <TableWithGrid
              title={"Lead Status"}
              data={this.leadData}
              columns={this.leadStatus}
              options={options as any}
            />
          )}
          {!isDealer() && (
            <TableWithGrid
              title={"Lead Customer"}
              data={this.leadCustomerData}
              columns={this.leadStatus}
              options={options as any}
            />
          )}
          {!isDealer() && (
            <TableWithGrid
              title={"Lead Dealer"}
              data={this.leadDealerData}
              columns={this.leadStatus}
              options={options as any}
            />
          )}
          <TableWithGrid
            title={"Annual Sales Target"}
            data={data.sales.data}
            columns={columns}
            options={options as any}
          />
        </div>
      </AppBar>
    );
  }
}

const styles = (theme: Theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: 24,
  },
  paper: {
    padding: theme.spacing.length * 2,
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  headerTiles: {
    overflowX: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRight: `5px solid ${theme.palette.secondary.main}`,
  },
  headerTileIcon: {
    fontSize: 40,
    color: theme.palette.primary.main,
    paddingRight: 5,
  },
  tileText: {
    fontSize: 20,
    color: theme.palette.grey["400"],
  },
  sectionTitle: {
    paddingLeft: theme.spacing.length * 2,
  },
  users: {
    marginBottom: 24,
    overflowX: "scroll",
  },
  chart: {
    width: "100%",
  },
});

export const HomePage = withStyles(styles as any)(HomePageImpl as any) as any;
