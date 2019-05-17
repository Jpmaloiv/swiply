import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from 'jwt-decode'

import { Elements, StripeProvider } from 'react-stripe-elements';

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

import Checkout from './components/Checkout/Checkout'
import PurchaseConfirmation from './components/Checkout/PurchaseConfirmation'

import MyPurchases from './components/Customer/MyPurchases'

import AddContent from './components/Content/AddContent'
import ContentView from './components/Content/ContentView'

import Profile from './components/Profile/Profile'
import EditProfile from './components/Profile/EditProfile'
import AccountSettings from './components/Account/AccountSettings'

import Example from './components/Example'


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
      <StripeProvider apiKey="pk_test_J71dqS8brtNIK1ZYN7LCiJvd00D8Kbx2K8">
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
                  <Route exact path='/' component={Register} />
                }
              </div>
            }

            <Switch>
              <Route path='/pages/add' component={AddPage} />
              <Route exact path='/pages/:pageId' component={PageView} />

              <Route exact path='/pages/:pageId/add-content' component={AddContent} />

              <Route exact path='/pages/:pageId/:contentId' component={ContentView} />

              <Route exact path='/profile/:profile' component={Profile} />
              <Route path='/profile/edit/:userId' component={EditProfile} />
              <Route path='/account/:userId' component={AccountSettings} />

              <Route path='/purchased' component={PurchaseConfirmation} />

              <Route path='/purchases' component={MyPurchases} />

              <Route path='/example' component={Example} />

              <Elements>
                <Route exact path='/checkout' component={Checkout} />
              </Elements>
            </Switch>



            <link
              rel="stylesheet"
              href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
              integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
              crossOrigin="anonymous"
            />

          </div>
        </Router>
      </StripeProvider>
    );
  }
}

// FontAwesome Library
library.add(faDollarSign, faEye, faPen, faPlus, faSignal, faSignOutAlt, faUser, faUserPlus)


export default App;

