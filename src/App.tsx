import * as React from "react";
import { Provider } from "react-redux";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import "./App.css";
const LoginScreen = React.lazy(() =>
  import("./pages/account/Login").then(({ LoginScreen }) => ({
    default: LoginScreen,
  }))
);
const BuyOrders = React.lazy(() =>
  import("./pages/BuyOrders").then(({ BuyOrders }) => ({ default: BuyOrders }))
);
const Communications = React.lazy(() =>
  import("./pages/Communicatios").then(({ Communications }) => ({
    default: Communications,
  }))
);
const Customers = React.lazy(() =>
  import("./pages/Customers").then(({ Customers }) => ({ default: Customers }))
);
const AddNewCustomer = React.lazy(() =>
  import("./pages/Customers/AddNewCustomer").then(({ AddNewCustomer }) => ({
    default: AddNewCustomer,
  }))
);
const HomePage = React.lazy(() =>
  import("./pages/Home").then(({ HomePage }) => ({ default: HomePage }))
);
const Inventory = React.lazy(() =>
  import("./pages/Inventory").then(({ Inventory }) => ({ default: Inventory }))
);
const Leads = React.lazy(() =>
  import("./pages/Leads").then(({ Leads }) => ({ default: Leads }))
);
const AddNewLead = React.lazy(() =>
  import("./pages/Leads/AddNewLead").then(({ AddNewLead }) => ({
    default: AddNewLead,
  }))
);
const Profile = React.lazy(() =>
  import("./pages/Profile").then(({ Profile }) => ({ default: Profile }))
);
const RTOProcess = React.lazy(() =>
  import("./pages/RTOProcess").then(({ RTOProcess }) => ({
    default: RTOProcess,
  }))
);
const Support = React.lazy(() =>
  import("./pages/support").then(({ Support }) => ({ default: Support }))
);
const AddNewJobCard = React.lazy(() =>
  import("./pages/JobCard").then(({ AddNewJobCard }) => ({
    default: AddNewJobCard,
  }))
);

import { store } from "./store/Store";
import { MyUsers } from "./pages/MyUsers";
import { JobCards } from "./pages/JobCard/JobCardList";
import { JobCardDetails } from "./pages/JobCard/JobCardDetails";
import { AssignedDealers } from "./pages/AssignedDealers";
import { DealerDetails } from "./pages/AssignedDealers/DealerDetails";
import { CustomerLeadDetails } from "./pages/Customers/CustomerLeadDetails";
import {
  getToken,
  isLoggedIn,
  saveLoggedInUserData,
  saveLoggedInUserToken,
} from "./state/Utility";
import { saveLoggedInUserDetails } from "./actions/App.Actions";
import { AddNewOrder } from "./pages/BuyOrders/AddNewOrder";
import { ForgotPassword } from "./pages/account/ForgotPassword";
import { SignupScreen } from "src/pages/account/Signup/Signup";
import "./main.scss";
import { FormEg } from "./pages/FormEg";

const Loader = () => (
  <div className="loader-main">
    <div className="hourglass"></div>
  </div>
);

class ProtectedRoute extends React.Component<any, any> {
  componentWillMount() {
    if (!isLoggedIn()) {
      return;
    }
    // const { userName } = isLoggedIn();
    // if (userName === "Demo") {
    //   saveLoggedInUserData({ userName });
    //   saveLoggedInUserDetails({ userName, isDealer: true, isDist: false });
    // }
    // if (userName === "DemoDist") {
    //   saveLoggedInUserData({ userName });
    //   saveLoggedInUserDetails({ userName, isDealer: false, isDist: true });
    // }
    const { recordType } = isLoggedIn();
    const { data } = getToken();
    const { token, sfid } = data;

    if (recordType === "0122w000000cwfSAAQ") {
      saveLoggedInUserData({ recordType });
      saveLoggedInUserToken({ data });
      saveLoggedInUserDetails({ data, isDealer: true, isDist: false });
    }
    if (recordType === "0122w000000cwfNAAQ") {
      saveLoggedInUserData({ recordType });
      saveLoggedInUserToken({ data });
      saveLoggedInUserDetails({ data, isDealer: false, isDist: true });
    }
  }

  render() {
    const { path, component } = this.props;
    console.log("isLoggedIn: ", isLoggedIn());
    if (isLoggedIn()) {
      return <Route path={path} exact component={component} />;
    }
    return <Redirect to="/" />;
  }
}

class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <Router>
          <React.Suspense fallback={<Loader />}>
            <Switch>
              <Route path="/" exact component={LoginScreen} />
              <Route path="/signup" exact={true} component={SignupScreen} />
              <Route path="/forgot-password" exact component={ForgotPassword} />
              <Route path="/eg-form" exact component={FormEg} />
              <ProtectedRoute path="/home" component={HomePage} />
              <ProtectedRoute path="/inventory" component={Inventory} />
              <ProtectedRoute
                path="/lead/add-new-lead"
                component={AddNewLead}
              />
              <ProtectedRoute
                path="/lead/edit-lead/:id"
                component={AddNewLead}
              />
              <ProtectedRoute path="/leads" component={Leads} />
              <ProtectedRoute
                path="/customer/customer-lead-details/:recordtypeid/:sfid"
                component={CustomerLeadDetails}
              />
              <ProtectedRoute
                path="/add-new-jobcard"
                component={AddNewJobCard}
              />
              <ProtectedRoute path="/job-cards/:recordtypeid/:sfid" component={JobCards} />
              <ProtectedRoute path="/job-card-details/:sfid" component={JobCardDetails} />

              <ProtectedRoute path="/customers" component={Customers} />
              <ProtectedRoute
                path="/customer/add-new-customer"
                component={AddNewCustomer}
              />
              <ProtectedRoute path="/transactions" component={Support} />
              <ProtectedRoute
                path="/assign-dealers"
                component={AssignedDealers}
              />
              <ProtectedRoute
                path="/dealers/dealer-details/:recordtypeid/:sfid"
                component={DealerDetails}
              />
              <ProtectedRoute path="/rto-process" component={RTOProcess} />
              <ProtectedRoute path="/buy-orders" component={BuyOrders} />
              <ProtectedRoute
                path="/buy-order/add-new-order"
                component={AddNewOrder}
              />
              <ProtectedRoute
                path="/communication"
                component={Communications}
              />
              <ProtectedRoute path="/support" component={Support} />
              <ProtectedRoute path="/profile" component={Profile} />
              <ProtectedRoute path="/my-users" component={MyUsers} />
            </Switch>
          </React.Suspense>
        </Router>
      </Provider>
    );
  }
}

export default App;
