import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { combineForms } from 'react-redux-form';
// import {
//   HashRouter as Router,
//   Route,
//   Switch,
//   Redirect,
// } from "react-router-dom";
// import MyForm from './App2';

// const initialUser = { name: '' };

// const store = createStore(combineForms({
//   user: initialUser,
//   userForm: { name: "", email: "" },
//   leadForm: { name: "", email: "" },
//   customerForm: {},
//   editUserForm: {},
// }));

// const Loader = () => (
//   <div className="loader-main">
//     <div className="hourglass"></div>
//   </div>
// );

// class Appxyz extends React.Component {
//   render() {
//     return (
//       <Provider store={ store }>
//         <Router>
//           <React.Suspense fallback={<Loader />}>
//             <Switch>
//               <Route path="/" exact component={MyForm} />
//             </Switch>
//           </React.Suspense>
//         </Router>
//          {/* <MyForm /> */}
//       </Provider>
//     );
//   }
// }

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement);
registerServiceWorker();
