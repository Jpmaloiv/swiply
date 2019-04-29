import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from 'jwt-decode'

// import logo from './logo.svg';
import './App.css';

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faDollarSign, faEye, faPen, faPlus, faSignal, faSignOutAlt, faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons'

import Navigation from './components/Navigation'
import Register from './components/Register'
import SignIn from './components/SignIn'
import Welcome from './components/Welcome'

import Dashboard from './components/Dashboard'

import AddPage from './components/Pages/AddPage'
import PageView from './components/Pages/PageView'

import AddContent from './components/Content/AddContent'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      decoded: false,
      login: false
    }
  }

  componentWillMount() {
    const loginToken = window.localStorage.getItem("token");
    if (loginToken) {
      this.setState({ decoded: jwt_decode(loginToken) })
    }
  }

  render() {
    return (
      <Router>
        <div className='body'>
          <Navigation
            decoded={this.state.decoded}
            login={this.state.login}
            setState={this.setState.bind(this)}
          />
          {this.state.decoded ?
            <div>
              <Route exact path='/' component={Welcome} />
              <Route path='/dashboard' component={Dashboard} />
            </div>
            :
            <div>
              {this.state.login ?
                <Route path='/' component={SignIn} />
                :
                <Route path='/' component={Register} />
              }
            </div>
          }
          <Switch>
            <Route path='/pages/add' component={AddPage} />
            <Route path='/pages/:pageId' component={PageView} />

            <Route path='/pages/:pageId/content/add' component={AddContent} />
          </Switch>

          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
            integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
            crossOrigin="anonymous"
          />
        </div>
      </Router>
    );
  }
}

// FontAwesome Library
library.add(faDollarSign, faEye, faPen, faPlus, faSignal, faSignOutAlt, faUser, faUserPlus)


export default App;

