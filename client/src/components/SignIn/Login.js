import axios from "axios";
import React, { Component } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";


export default class Login extends Component {

  // Handle user input
  handleChange = e => {
    console.log(e.target);
    this.props.setState({ [e.target.name]: e.target.value });
  };

  enterPressed(event) {
    var code = event.keyCode || event.which;
    if (code === 13) {
      //13 is the enter keycode
      this.login();
    }
  }

  login() {
    axios
      .post(
        `api/auth/login?email=${this.props.state.email}&password=${this.props.state.password}&role=${this.props.state.role}`
      )
      .then(resp => {
        console.log(resp);
        if (resp.data.success === true) {
          // this.props.setState({
          //     view: 'VerifyAccount'
          // })
          window.localStorage.setItem("token", resp.data.token);
          window.location.reload();
        } else {
          window.alert("Invalid login information. Please try again");
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
          <h3 style={{padding: "5% 0"}}>Welcome Back</h3>
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
            />
          </InputGroup>
          <InputGroup
            style={{
              display: "flex",
              flex: "initial",
              margin: "1em auto",
              width: "70%"
            }}
          >
            <FormControl
              placeholder="Enter Password"
              type="password"
              name="password"
              onChange={this.handleChange}
              onKeyPress={this.enterPressed.bind(this)}
            />
          </InputGroup>
          {/* <InputGroup> */}
          {/* <FormControl
                            className='verificationInput'
                            placeholder='+1 000 000 0000'
                            name='phone'
                            onChange={this.handleChange}
                        />
                    </InputGroup> */}
          {/* <p>Please enter your phone number to sign in.</p> */}

          <Button variant="success" size="lg" onClick={this.login.bind(this)}>
            Continue
          </Button>
        </div>
      </ReactCSSTransitionGroup>
    );
  }
}
