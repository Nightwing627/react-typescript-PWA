import {
  Divider,
  Drawer,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Theme,
  withStyles,
  Typography,
} from "@material-ui/core";
import {
  Book,
  Chat,
  HeadsetMic,
  AccountCircle,
  Pages,
  Payment,
  People,
  Share,
  PersonPin,
  FiberNew
} from "@material-ui/icons";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DashboardIcon from "@material-ui/icons/Dashboard";
import * as React from "react";
import { NavLink } from "react-router-dom";
import { User } from "../state/User";
import { Utility, isDealer } from "../state/Utility";
import { styles } from "./styles";
import { connect } from "react-redux";
const classNames = require("classnames");

interface IAppDrawer {
  authentication?: User;
  utility: Utility;
  classes?: any;
  onRouteChange: (routeName: string) => void;
  theme?: Theme;
  handleDrawerClose?: () => void;
}
export const routes = (isDealerApp) => [

  { path: "/home", title: "Home", icon: () => <DashboardIcon /> },
  {
    hidden: true,
    path: "/profile",
    title: "Profile",
    icon: () => <PersonPin />,
  },
  { path: "/inventory", title: "Inventory", icon: () => <Book /> },
  {
    path: "/buy-orders",
    title: isDealerApp ? "Buy Orders" : "Buy/Sell Orders",
    icon: () => <Payment />,
  },
  { path: "/leads", title: "Leads", icon: () => <Pages /> },
  {
    path: "/assign-dealers",
    hideForDealer: true,
    title: "Assigned Dealers",
    icon: () => <Share />,
  },
  { path: "/customers", title: "Customer", icon: () => <People /> },
  {
    hidden: true,
    path: "/customer/add-new-customer",
    title: "Add New Customer",
    icon: () => <FiberNew/>
  },
  {
    path: "/add-new-jobcard",
    title: "Add New JobCard",
    hideForDistributor: true,
    icon: () => <FiberNew/>
  },
  {
    hidden: true,
    path: "/job-cards",
    title: "Job Cards",
    icon: () => <FiberNew/>
  },
  {
    hidden: true,
    path: "/job-card-details",
    title: "Job Card Details",
    icon: () => <FiberNew/>
  },
  {
    hidden: true,
    path: "/lead/add-new-lead",
    title: isDealer() ? "Add New Customer Lead" : "Add New Dealer Lead",
    icon: () => <Pages /> 
  },
  {
    hidden: true,
    path: "/lead/edit-lead",
    title: isDealer() ? "Lead Details - Customer" : "Lead Details - Dealer",
    icon: () => <Pages /> 
  },
  {
    path: "/customer/customer-lead-details",
    title: "Customer Details",
    hidden: true,
    icon: () => <Chat />,
  },
  {
    hidden: true,
    path: "/transactions",
    title: "Transactions",
    icon: () => <Book />,
  },
  { path: "/rto-process", title: "RTO Process", icon: () => <HeadsetMic /> },
  { path: "/communication", title: "Communications", icon: () => <Book /> },
  {
    path: "/my-users",
    hideForDealer: true,
    title: "My Users",
    icon: () => <Book />,
  },
  { path: "/support", title: "Support", icon: () => <Chat /> },
  {
    path: "/dealers/dealer-details",
    title: "Dealer Details",
    hidden: true,
    icon: () => <Chat />,
  },
  {
    path: "/buy-order/add-new-order",
    title: "Orders",
    hidden: true,
    icon: () => <Chat />,
  },
  {
    path: "/eg-form",
    title: "Orders",
    hidden: true,
    icon: () => <Chat />,
  },
];

class AppDrawer extends React.Component<IAppDrawer, {}> {
  public render(): JSX.Element {
    const { authentication, classes, utility, theme } = this.props;
    return (
      <Drawer
        hidden={!authentication}
        variant="permanent"
        classes={{
          paper: classNames(
            classes.drawerPaper,
            !utility.drawerOpen && classes.drawerPaperClose
          ),
        }}
        open={utility.drawerOpen}
      >
        <div className="profile">
          <div className="content">
            <AccountCircle className="profile-icon" fontSize="large" />
            <Typography variant="h5" color="inherit" noWrap={true}>
              <NavLink
                onClick={() => this.props.onRouteChange("Profile")}
                exact={true}
                className="drawer-link"
                to={"/profile"}
              >
                Profile
              </NavLink>
            </Typography>
          </div>
          <div className={classes.toolbar}>
            <IconButton onClick={this.props.handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
        </div>
        <Divider />
        {routes(this.props.isDealer)
          .filter((x) => !x.hidden)
          .filter((x) => (isDealer() ? !x.hideForDealer : true))
          .filter((x) => (!isDealer() ? !x.hideForDistributor : true))
          .map((route, index) => {
            return (
              <NavLink
                key={index}
                onClick={() => this.props.onRouteChange(route.title)}
                exact={true}
                className="drawer-link"
                to={route.path}
              >
                <ListItem button={true}>
                  <ListItemIcon>{route.icon()}</ListItemIcon>
                  <ListItemText primary={route.title} />
                </ListItem>
              </NavLink>
            );
          })}
        <Divider />
        <div className="cp-root">
          <div>
            <div className="copyright padding-6">Copyright © 2020</div>
            <div className="company padding-6">Green Globe Fuel Solutions</div>
          </div>
          <div className="ver">App Ver - 1.0</div>
        </div>{" "}
        <Divider />
      </Drawer>
    );
  }
}

const mapStateToProps = (state) => {
  return { isDealer: isDealer(), state };
};

export default connect(mapStateToProps)(
  withStyles(styles as any, { withTheme: true })(AppDrawer as any) as any
);
