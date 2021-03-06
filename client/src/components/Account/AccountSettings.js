import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import jwt_decode from "jwt-decode";
import React, { Component } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { NotificationContainer, NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";


export default class AccountSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        password: '',
        confirmpw: '',
        oldPassword: ''
      },
    };
  }

  componentWillMount() {
    this.fetchUser();
  }

  fetchUser() {
    const loginToken = window.localStorage.getItem("token");
    let decoded = "";
    if (loginToken) decoded = jwt_decode(loginToken);

    let role = "";
    if (decoded.role === "user") role = "users";
    if (decoded.role === "customer") role = "customers";
    this.setState({ role: decoded.role });

    axios
      .get(`/api/${role}/search?id=` + decoded.id)
      .then(resp => {
        this.setState(
          {
            user: resp.data.response[0],
            S3_BUCKET: resp.data.bucket
          },
          this.imageCheck
        );
      })
      .catch(error => {
        console.error(error);
      });
  }


  imageCheck() {
    const { user } = this.state;
    if (user.imageLink) {
      user.imageLink = `https://s3-us-west-1.amazonaws.com/${
        this.state.S3_BUCKET
        }/${user.imageLink}`;
      this.setState({ render: !this.state.render });
    }
  }

  // Handles user input
  handleChange = e => {
    console.log(e.target, "asdf");
    this.state.user[e.target.name] = e.target.value;
  };

  // Handles when the user presses 'Enter' on input fields
  enterPressed(event) {
    var code = event.keyCode || event.which;
    if (code === 13) {
      this.updateUser();
    }
  }

  // Preview image once seleted
  onImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      this.state.user.imageLink = URL.createObjectURL(file);
      this.setState({
        file: file,
        fileName: file.name,
        fileType: file.type
      });
    }
  };

  createNotification = type => {
    return () => {
      switch (type) {
        case "success":
          NotificationManager.success("Account updated", "", 2500);
          break;
        case "error":
          NotificationManager.error("Error updating account", "", 2500);
          break;
        case "warning":
          NotificationManager.warning(
            "Passwords do not match",
            "Error updating account",
            2500
          );
          break;
        case "passwordError":
          NotificationManager.error("Wrong original password", "", 2500);
          break;
      }
    };
  };

  // Updates user with any changes made
  updateUser() {
    const { user } = this.state;
    const { password, confirmpw, oldPassword } = this.state.user;
    console.log(user)

    let role = "";
    if (this.state.role === "user") role = "users";
    if (this.state.role === "customer") role = "customers";

    let data = new FormData();
    data.append("imgFile", this.state.file);

    let query = "";
    if (password) {
      if (password === confirmpw) query = `&password=${password}&oldPassword=${oldPassword}`;
      else return this.warning.click();
    }

    console.log(query)
    axios.put(`/api/${role}/update?id=` + this.state.user.id +
      "&title=" +
      user.title +
      "&email=" +
      user.email +
      "&summary=" +
      user.summary +
      query,
      data
    )
      .then(res => {
        console.log(res);
        if (res.data.message === "Wrong original password") {
          this.passwordError.click();
        } else {
          this.success.click();
          this.props.history.go(-1)
        }
      })
      .catch(err => {
        console.error(err);
        this.error.click();
      });
  }

  render() {
    const { role, user } = this.state;
    console.log(this.state);

    return (
      <ReactCSSTransitionGroup
        transitionName="fade"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnter={false}
        transitionLeave={false}
      >
        <div>
          <div className="center" style={{ textAlign: "initial", marginBottom: 0 }}>
            <h2 style={{ textAlign: "center" }}>Account Settings</h2>

            <Form style={{ padding: "25px 75px" }} autoComplete='off'>
              <div className="profilePic">
                {user.imageLink ? (
                  <div>
                    <img
                      src={user.imageLink}
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
                      onClick={() => {
                        this.upload.click();
                      }}
                    />
                  </div>
                ) : (
                    <FontAwesomeIcon
                      icon="user-plus"
                      size="2x"
                      color="white"
                      style={{ opacity: 0.8 }}
                      onClick={() => {
                        this.upload.click();
                      }}
                    />
                  )}
              </div>
              {user.imageLink ? (
                <span />
              ) : (
                  <p
                    style={{
                      fontSize: 12,
                      textAlign: "center",
                      marginTop: ".5rem"
                    }}
                  >
                    Add Profile Image
                </p>
                )}

              <Form.Group>
                <input
                  type="file"
                  name="imgFile"
                  ref={ref => (this.upload = ref)}
                  onChange={this.onImageChange}
                  style={{ display: "none" }}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Old Password</Form.Label>

                {/* Weird AutoComplete behavior */}
                <input
                  type="password"
                  style={{ display: 'none' }}
                  placeholder="Old Password"
                  value={user.password}
                  name="oldPassword"
                  onChange={this.handleChange}
                  autoComplete='pseudo'
                />

                <Form.Control
                  type="password"
                  placeholder="Old Password"
                  value={user.password}
                  name="oldPassword"
                  onChange={this.handleChange}
                  onKeyPress={this.enterPressed.bind(this)}
                />

              </Form.Group>
              <Form.Group>
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="New Password"
                  name="password"
                  onChange={this.handleChange}
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
              {role === "user" ? (
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    placeholder={user.title}
                    name="title"
                    onChange={this.handleChange}
                    onKeyPress={this.enterPressed.bind(this)}
                  />
                </Form.Group>
              ) : (
                  <span />
                )}
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <input
                  type='email'
                  style={{ opacity: 0 }}
                  placeholder="Email Address"
                  name="new-email"
                  onChange={this.handleChange}
                  autoComplete='new-email'
                />

                <Form.Control
                  type='email'
                  placeholder={user.email}
                  value={this.state.email}
                  name="email"
                  onChange={this.handleChange}
                  autoComplete='nope'
                  onKeyPress={this.enterPressed.bind(this)}
                />

              </Form.Group>
              {role === "user" ? (
                <Form.Group>
                  <Form.Label>Profile Summary</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows='4'
                    placeholder={user.summary}
                    name="summary"
                    onChange={this.handleChange}
                    onKeyPress={this.enterPressed.bind(this)}
                  />
                </Form.Group>
              ) : (
                  <span />
                )}
              <Button
                variant="success"
                size="lg"
                style={{ display: "block" }}
                onClick={this.updateUser.bind(this)}
              >
                Update Account
          </Button>
            </Form>

          </div>
        </div>

        <button
          className="btn btn-success"
          onClick={this.createNotification("success")}
          ref={ref => (this.success = ref)}
          style={{ display: "none" }}
        >
          Success
        </button>
        <button
          className="btn btn-danger"
          onClick={this.createNotification("error")}
          ref={ref => (this.error = ref)}
          style={{ display: "none" }}
        >
          Error
        </button>
        <button
          className="btn btn-warning"
          onClick={this.createNotification("warning")}
          ref={ref => (this.warning = ref)}
          style={{ display: "none" }}
        >
          Error
        </button>
        <button
          className="btn btn-danger"
          onClick={this.createNotification("passwordError")}
          ref={ref => (this.passwordError = ref)}
          style={{ display: "none" }}
        >
          Error
        </button>

        <NotificationContainer />
      </ReactCSSTransitionGroup>
    );
  }
}
