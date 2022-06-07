import { IAppAction, ActionType, SAVE_LOGGED_IN_USER_DATA } from "./Helpers";
import { match } from "react-router";
import { Utility, dispatch } from "../state/Utility";
import { Alert } from "../state/Alert";
import { Spinner } from "../state/Spinner";
import { User } from "../state/User";
import { store } from "../store/Store";

export interface IApplicationProps {
  openDrawer: () => IAppAction;
  closeDrawer: () => IAppAction;
  showPopup: (alert: Alert) => IAppAction;
  closePopup: () => IAppAction;
  showSpinner: (message: string) => IAppAction;
  hideSpinner: () => IAppAction;
  login: (data: any) => IAppAction;
  logout: () => IAppAction;
  match: match<any>;
  location: any;
  history: any;
  utility: Utility;
  authentication: User;
  users: any;
  materials: any;
  mail: any[];
  materialCharts: Array<{ name: string; value: number; fill: string }>;
}

export const openDrawer = (): IAppAction => {
  return store.dispatch({
    type: ActionType.OPEN_DRAWER,
  });
};

export const closeDrawer = (): IAppAction => {
  return store.dispatch({
    type: ActionType.CLOSE_DRAWER,
  });
};

export const showPopup = (data: Alert): IAppAction => {
  return store.dispatch({
    type: ActionType.OPEN_ALERT,
    payload: data,
  });
};

export const closePopup = (): IAppAction => {
  return store.dispatch({
    type: ActionType.CLOSE_ALERT,
  });
};

export const showSpinner = (message: string): IAppAction => {
  return store.dispatch({
    type: ActionType.OPEN_SPINNER,
    payload: new Spinner({ message }),
  });
};

export const hideSpinner = (): IAppAction => {
  return store.dispatch({
    type: ActionType.CLOSE_SPINNER,
  });
};

export const login = (data: any): IAppAction => {
  return store.dispatch({ type: ActionType.LOGIN_REQUEST, payload: data });
};

export const logout = (): IAppAction => {
  return store.dispatch({ type: ActionType.LOGOUT_REQUEST });
};

export const saveDealerData = (data) =>
  store.dispatch({
    type: "SAVE_DEALER_DETAILS",
    data,
  });
export const saveLeadsData = (data) =>
  store.dispatch({
    type: "SAVE_LEADS_DETAILS",
    data,
  });
export const saveAssignedDealersData = (data) =>
  store.dispatch({
    type: "SAVE_ASSIGNED_DEALERS_DETAILS",
    data,
  });
export const saveSelectData = (data) =>
  store.dispatch({
    type: "SAVE_DETAILS",
    data,
  });
export const saveOrderData = (data) =>
  store.dispatch({
    type: "SAVE_ORDER_DETAILS",
    data,
  });
export function saveLoggedInUserDetails(data) {
  return dispatch({
    type: "SAVE_LOGGED_IN_USER_DATA",
    data,
  });
}