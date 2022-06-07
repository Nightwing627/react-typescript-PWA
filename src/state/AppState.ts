import { Model } from "./Helpers";
import { User } from "./User";
import { Utility } from "./Utility";

export interface IAppState {
  utility?: Utility;
  authentication?: User;
  users?: any;
  materials?: any;
  mail?: any;
}

export const AppStateModel = Model<IAppState>({
  utility: new Utility(),
  authentication: null,
  users: null,
  materials: null,
  mail: null,
});

export class AppState extends AppStateModel {
  public static UTILITY = "utility";
  public static AUTHENTICATION = "authentication";

  public utility: Utility;
  public authentication: User;
  public users: any;
  public materials: any;
  public mail: any;
}

export const isAuthenticated = () => {
  // const isUserLoggedIn = localStorage.getItem("userData");
  // if (JSON.parse(isUserLoggedIn)) {
  //   return true;
  // }
  return true
};