import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux'
import store from './store'

/* Styles */
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Landing from './components/auth/Landing';
import HomePage from './components/main/HomePage';

function App() {
  return (
    <Provider store={store}>
      <div>
        <Router>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/dev-talks" component={HomePage} />
          </Switch>
        </Router>
      </div>
    </Provider>
  );
}

export default App;
