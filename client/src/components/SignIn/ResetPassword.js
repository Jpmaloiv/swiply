import React, { Component } from 'react'
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { NotificationContainer, NotificationManager } from "react-notifications";
import axios from 'axios'
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";


export default class ResetPassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            resetPassword: false
        }

    }

    // Handles when the user presses 'Enter' on input fields
    enterPressed(event) {
        var code = event.keyCode || event.which;
        if (code === 13) {
            this.resetPassword();
        }
    }

    resetPassword() {
        axios.post(`/api/auth/reset-password?email=${this.state.email}&role=${this.props.state.role}`)
            .then((resp) => {
                console.log(resp)
                if (resp.data.success == true) {
                    this.success.click(); this.setState({ resetPassword: true })
                }
                else {
                    this.error.click()
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }

    createNotification = type => {
        return () => {
            switch (type) {
                case "success":
                    NotificationManager.success("Check your inbox", "Password reset email sent", 2500);
                    break;
                case "error":
                    NotificationManager.error("No user found", "", 2500);
                    break;
            }
        };
    };

    render() {
        let role = ''
        if (this.props.state.role === 'user') role = 'Content Provider'
        if (this.props.state.role === 'customer') role = 'Customer'
        return (
            <ReactCSSTransitionGroup
                transitionName="fade"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnter={false}
                transitionLeave={false}
            >
                <div className='center'>
                    <h3>Reset Password - {role}</h3> <br />
                    {!this.state.resetPassword ?
                        <div>
                            <h5>Please enter your email, and we'll send you a link to reset your password.</h5>
                            <br />
                            <Form.Group>
                                <Form.Control
                                    placeholder='Enter Your Email'
                                    onChange={(e) => this.setState({ email: e.target.value })}
                                    style={{ width: '70%', margin: '0 auto' }}
                                    onKeyPress={this.enterPressed.bind(this)}
                                />
                            </Form.Group>
                            <Button
                                variant='success'
                                onClick={this.resetPassword.bind(this)}
                                disabled={!this.state.email}
                            >
                                Reset My Password
                            </Button>
                        </div>
                        :
                        <p>We've just sent you an email with a link to reset your password with Swiply.
                        Please note that this link will expire in one hour.
                        </p>
                    }
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

                <NotificationContainer />

            </ReactCSSTransitionGroup>
        )
    }
}