import axios from "axios";
import React, { Component } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { NotificationContainer, NotificationManager } from "react-notifications";

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from 'react-bootstrap/Form'
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";


export default class Login extends Component {

  // Handle user input
  handleChange = e => {
    this.props.setState({ [e.target.name]: e.target.value });
  };

  // Handles when the user presses 'Enter' on input fields
  enterPressed(event) {
    var code = event.keyCode || event.which;
    if (code === 13) {
      this.login();
    }
  }

  createNotification = type => {
    return () => {
      switch (type) {
        case "error":
          NotificationManager.error("Please try again", "Invalid information", 2500);
          break;
      };
    };
  }

  login() {
    axios
      .post(
        `api/auth/login?email=${this.props.state.email}&password=${this.props.state.password}&role=${this.props.state.role}`
      )
      .then(resp => {
        console.log(resp);
        if (resp.data.success === true) {
          window.localStorage.setItem("token", resp.data.token);
          window.location.reload();
        } else {
          this.error.click()
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName="fade"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnter={false}
        transitionLeave={false}
      >
        <div className="center">
          <h2>Login</h2>
          <ButtonGroup style={{ width: "100%" }}>
            <Button
              variant="link"
              active={this.props.state.role === "user"}
              onClick={() => this.props.setState({ role: "user" })}
            >
              Content Provider
            </Button>
            <Button
              variant="link"
              active={this.props.state.role === "customer"}
              onClick={() => this.props.setState({ role: "customer" })}
            >
              Customer
            </Button>
          </ButtonGroup>
          <br />
          <h3 style={{ padding: "5% 0" }}>Welcome Back</h3>
          <InputGroup
            style={{
              display: "flex",
              flex: "initial",
              margin: "1em auto",
              width: "70%"
            }}
          >
            <FormControl
              placeholder="Enter Email Address"
              name="email"
              onChange={this.handleChange}
              onKeyPress={this.enterPressed.bind(this)}
            />
          </InputGroup>
          <InputGroup
            style={{
              margin: "1em auto",
              width: "70%"
            }}
          >
            <FormControl
              placeholder="Enter Password"
              type="password"
              name="password"
              style={{width: '100%'}}
              onChange={this.handleChange}
              onKeyPress={this.enterPressed.bind(this)}
            />
            <Form.Text className="text-muted" onClick={() => this.props.setState({ view: 'ResetPassword' })} style={{cursor: 'pointer', width: '100%', textAlign: 'right', color: 'blue !important', textDecoration: 'underline'}}>
              Forgot password?
              </Form.Text>
          </InputGroup>

          <Button variant="success" size="lg" onClick={this.login.bind(this)}>
            Continue
          </Button>
        </div>

        <button
          className="btn btn-danger"
          onClick={this.createNotification("error")}
          ref={ref => (this.error = ref)}
          style={{ display: "none" }}
        >
          Error
        </button>

        <NotificationContainer />
      </ReactCSSTransitionGroup>
    );
  }
}
