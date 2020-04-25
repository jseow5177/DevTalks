import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';

import store from './store';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import { removeActiveChannel } from './actions/channelActions';

/* Styles */
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Landing from './components/auth/Landing';
import HomePage from './components/main/HomePage';
import PrivateRoute from './components/PrivateRoute';

// Check for token in the localStorage of browser
// If token exists, user is automatically authenticated
// If token expires, logout user
if (localStorage.jwtToken) {
  // Get the token
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and set current user
  const decoded = jwt_decode(token);
  store.dispatch(setCurrentUser(decoded));

  // Check if token is expired
  const currentTime = Date.now() / 1000
  if (decoded.exp < currentTime) {
    console.log('logout!');
    store.dispatch(logoutUser());
    store.dispatch(removeActiveChannel());
  }

}

function App() {
  return (
    <Provider store={store}>
      <div>
        <Router>
          <Switch>
            <Route exact path="/" component={Landing} />
            <PrivateRoute exact path="/dev-talks" component={HomePage} />
          </Switch>
        </Router>
      </div>
    </Provider>
  );
}

export default App;
