import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import { createStore, applyMiddleware } from 'redux';

import './App.css';

const store = createStore(() => [], {}, applyMiddleware)

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          {/* we use Exact here or else another path like /test would still show this page */}
          <Route exact path="/" component={Landing} />
          <div className="container">
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
