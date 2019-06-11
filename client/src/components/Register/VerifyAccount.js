import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import axios from 'axios'

import { NotificationContainer, NotificationManager } from "react-notifications";
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'


export default class VerifyAccount extends Component {
    constructor(props) {
        super(props)
        this.state = {
            code: ''
        }
    }

    // Handle user input
    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };


    /* Verifies the user with the verification code sent via SMS */
    verifyAccount() {
        // Switches to the Profile Summary screen
        if (this.state.code === JSON.stringify(this.props.state.verifyCode)) {
            this.props.setState({ view: 'ProfileSummary' })
        } else {
            this.error.click()
        }

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

    enterPressed(event) {
        var code = event.keyCode || event.which;
        if (code === 13) {
            if (this.props.state.customer) this.register()
            else this.verifyAccount();
        }
    }

    createNotification = type => {
        return () => {
            switch (type) {
                case "error":
                    NotificationManager.error("Please try again", "Invalid verification code", 2500);
                    break;
            };
        }
    }


    render() {
        console.log(this.props.state)

        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
                <div className='center'>
                    <h3>Verify Your Account</h3>
                    <InputGroup>
                        <FormControl
                            className='verificationInput'
                            placeholder='0000'
                            name='code'
                            onChange={this.handleChange}
                            onKeyPress={this.enterPressed.bind(this)}
                        />
                    </InputGroup>
                    <p>We sent a 4 digit confirmation code to<br />
                        {this.props.state.phone}<br />
                        You should get it in a few seconds</p>

                    {this.props.state.customer ?
                        <Button variant='success' size='lg' onClick={this.register.bind(this)}>
                            Register
                        </Button>
                        :
                        <Button variant='success' size='lg' onClick={this.verifyAccount.bind(this)}>
                            Continue
                        </Button>
                    }
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
        )
    }
}
