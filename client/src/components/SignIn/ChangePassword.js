import React, { Component } from 'react'
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import axios from 'axios'
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { NotificationContainer, NotificationManager } from "react-notifications";
import moment from 'moment'



export default class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: false
        };
    }

    componentWillMount() {
        const now = moment().format()
    
        axios.get(`/api/users/search?token=${this.props.match.params.token}`)
            .then((resp) => {
                console.log(resp)
                console.log(now, resp.data.response[0].updatedAt)
                let expiry = moment(resp.data.response[0].updatedAt).add(1, 'hours').format()

                if (resp.data.success == true && now < expiry)
                    this.setState({
                        token: true,
                        user: resp.data.response[0]
                    })
            })
            .catch((error) => {
                console.error(error)
            })
    }

    // Handles when the user presses 'Enter' on input fields
    enterPressed(event) {
        var code = event.keyCode || event.which;
        if (code === 13) {
            this.updatePassword();
        }
    }

    updatePassword() {
        if (this.state.password === this.state.confirmpw) {
            axios.put(`/api/users/update?id=${this.state.user.id}&password=${this.state.password}&token=${true}`)
                .then(resp => {
                    console.log(resp);
                    window.location = '/'
                })
                .catch(err => {
                    console.error(err);
                });
        } else {
            this.passwordMismatch.click();
        }
    }

    createNotification = type => {
        return () => {
            switch (type) {
                case "passwordMismatch":
                    NotificationManager.warning("Passwords do not match", 'Error updating password', 2500)
                    break;
            }
        };
    };


    render() {
        return (
            <ReactCSSTransitionGroup
                transitionName="fade"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnter={false}
                transitionLeave={false}
            >
                <div className='center'>
                    <h3>Change Password</h3><br />
                    {this.state.token ?
                        <div>
                            <Form.Group>
                                <Form.Control
                                    placeholder='Enter New Password'
                                    onChange={(e) => this.setState({ password: e.target.value })}
                                    style={{ width: '70%', margin: '0 auto' }}
                                    type='password'
                                    onKeyPress={this.enterPressed.bind(this)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                    placeholder='Confirm New Password'
                                    onChange={(e) => this.setState({ confirmpw: e.target.value })}
                                    style={{ width: '70%', margin: '0 auto' }}
                                    type='password'
                                    onKeyPress={this.enterPressed.bind(this)}
                                />
                            </Form.Group>
                            <Button
                                variant='success'
                                onClick={this.updatePassword.bind(this)}
                                disabled={!this.state.password || !this.state.confirmpw}
                            >
                                Update Password
                            </Button>
                        </div>
                        :
                        <div>
                            This password reset link has either expired or is invalid.
                        </div>
                    }
                </div>

                <button
                    className="btn btn-warning"
                    onClick={this.createNotification("passwordMismatch")}
                    ref={ref => (this.passwordMismatch = ref)}
                    style={{ display: "none" }}
                >
                    Error
                </button>

                <NotificationContainer />

            </ReactCSSTransitionGroup>
        )
    }
}