import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { Component } from "react";

import { NotificationContainer, NotificationManager } from "react-notifications";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";


export default class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: ""
    };
    if (window.performance) {
      if (performance.navigation.type == 1) {
        window.localStorage.clear();
      }
    }
  }

  /* Checks to see if user already exists in database */
  verifyUser() {

    // Validates email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.props.state.email)) {
      this.invalidEmail.click()
      return
    }

    if (this.props.state.password !== this.props.state.confirmpw) {
      this.passwordMismatch.click()
      return
    }

    axios.post(`api/users/verify?email=${this.props.state.email}`)
      .then(resp => {
        console.log(resp)
        if (resp.data.response) this.duplicateUser.click();
        else this.props.setState({ view: 'ProfileSummary' })
      })
      .catch(err => {
        console.error(err)
      })

  }

  // Handle user input
  handleChange = e => {
    this.props.setState({ [e.target.name]: e.target.value });
  };

  // Preview image once seleted
  onImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      this.props.setState({
        image: URL.createObjectURL(file),
        file: file,
        fileName: file.name,
        fileType: file.type
      });
    }
  };

  enterPressed(event) {
    const user = this.props.state
    if (user.email && user.password && user.confirmpw) {
      var code = event.keyCode || event.which;
      if (code === 13) {
        if (this.props.state.customer) this.register()
        else this.verifyUser();
      }
    }
  }

  createNotification = type => {
    return () => {
      switch (type) {
        case "duplicateUser":
          NotificationManager.error("Please log in", "User already exists", 2500);
          break;
        case "passwordMismatch":
          NotificationManager.warning("Passwords do not match", 'Error creating account')
          break;
        case "invalidEmail":
          NotificationManager.error("Please try again", "Invalid email ", 2500);
          break;
      };
    };
  }

  // Register the new customer
  register() {
    const user = this.props.state;
    if (user.password === user.confirmpw) {
      let data = new FormData();
      data.append("imgFile", user.file)
      axios.post('api/customers/register?firstName=' + user.firstName + '&lastName=' + user.lastName + '&email=' + user.email +
        '&password=' + user.password + '&phone=' + user.phone + '&summary=' + user.summary, data)
        .then((resp) => {
          console.log(resp)
          window.localStorage.setItem("token", resp.data.token);
          window.location = '/checkout'
        }).catch((error) => {
          console.error(error);
        })
    }
  }

  render() {

    console.log(this.props, this.state)


    const { page } = this.props.state;

    return (
      <ReactCSSTransitionGroup
        transitionName="fade"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnter={false}
        transitionLeave={false}
      >
        <Form.Group style={{ backgroundColor: '#f7f8f9', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <input
            type="file"
            name="imgFile"
            ref={ref => (this.upload = ref)}
            onChange={this.onImageChange}
            style={{ display: "none" }}
          />
          <div className="profilePic" onClick={() => {
            this.upload.click();
          }}>
            {this.props.state.image ? (
              <div>
                <img
                  src={this.props.state.image}
                  style={{
                    width: 75,
                    height: 75,
                    borderRadius: "50%",
                    objectFit: "cover"
                  }}
                  alt=""
                />
                <FontAwesomeIcon
                  icon="user-plus"
                  style={{ opacity: 0.2, position: "absolute" }}
                />
              </div>
            ) : (
                <img src={require(`../../images/profile-image.png`)} alt='Profile image' style={{ cursor: 'pointer' }} />
              )}
          </div>
          {this.props.state.image ? (
            <span />
          ) : (
              <p style={{ fontSize: 16, marginTop: ".5rem", marginBottom: 0, textAlign: 'center' }}>
                Add Profile Image
                </p>
            )}
        </Form.Group>
        <div className="center" style={{ textAlign: 'initial' }}>

          <Form>
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                placeholder="First Name"
                name="firstName"
                onChange={this.handleChange}
                onKeyPress={this.enterPressed.bind(this)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                placeholder="Last Name"
                name="lastName"
                onChange={this.handleChange}
                onKeyPress={this.enterPressed.bind(this)}

              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email Address</Form.Label>
              <input
                type='email'
                style={{ display: 'none' }}
                placeholder="Email Address"
                value={this.state.email}
                name="email"
                onChange={this.handleChange}
                autoComplete='pseudo'
              />
              <Form.Control
                type='email'

                placeholder="Email Address"
                value={this.state.email}
                name="email"
                onChange={this.handleChange}
                autoComplete="nope"
                onKeyPress={this.enterPressed.bind(this)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Password</Form.Label>
              <input type="password" name="pwd" autocomplete="new-password" style={{ display: 'none' }}></input>


              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                onChange={this.handleChange}
                autoComplete='off'
                onKeyPress={this.enterPressed.bind(this)}

              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                name="confirmpw"
                onChange={this.handleChange}
                onKeyPress={this.enterPressed.bind(this)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Check type="checkbox" label="Remember me" style={{ textAlign: 'center' }} />
            </Form.Group>
          </Form>

          {this.props.state.customer ? (
            <div style={{ textAlign: "center" }}>
              <div
                className="page"
                style={{ display: "flex", flex: "initial", margin: "1em auto", padding: 7.5 }}
              >
                <img
                  src={`https://s3-us-west-1.amazonaws.com/${
                    this.props.state.s3Bucket
                    }/${page.imageLink}`}
                  style={{ height: 90, minWidth: 90, maxWidth: 90, objectFit: 'cover', borderRadius: 3 }}
                />
                <div style={{ width: "100%", textAlign: "left", marginLeft: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                  <p style={{ fontSize: 18, fontWeight: 'bold' }}>{page.name}</p>
                  <p style={{ fontSixe: 14 }}>{page.description}</p>
                </div>
                <div>${page.price}</div>
              </div>
            </div>
          ) : (
              <span />
            )}

          {this.props.state.customer ?
            <Button
              variant='success'
              size='lg'
              style={{ display: 'block' }}
              onClick={this.register.bind(this)}
              disabled={!this.props.state.email || !this.props.state.password || !this.props.state.confirmpw}
            >
              Register
                        </Button>
            :
            <Button
              variant="success"
              size="lg"
              style={{ display: 'block' }}
              onClick={this.verifyUser.bind(this)}
              disabled={!this.props.state.email || !this.props.state.password || !this.props.state.confirmpw}
            >
              Continue
          </Button>
          }

        </div>

        <button
          className="btn btn-danger"
          onClick={this.createNotification("invalidEmail")}
          ref={ref => (this.invalidEmail = ref)}
          style={{ display: "none" }}
        >
          Error
        </button>
        <button
          className="btn btn-warning"
          onClick={this.createNotification("passwordMismatch")}
          ref={ref => (this.passwordMismatch = ref)}
          style={{ display: "none" }}
        >
          Error
        </button>
        <button
          className="btn btn-danger"
          onClick={this.createNotification("duplicateUser")}
          ref={ref => (this.duplicateUser = ref)}
          style={{ display: "none" }}
        >
          Error
        </button>

        <NotificationContainer />

      </ReactCSSTransitionGroup>
    );
  }
}
