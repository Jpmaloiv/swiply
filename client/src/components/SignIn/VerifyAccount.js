import axios from 'axios';
import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';



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
    login() {
        let role = ''
        if (this.props.state.role === 'user') role = 'users'
        if (this.props.state.role === 'customer') role = 'customers'

        // Switches to the Profile Summary screen
        if (this.state.code === JSON.stringify(this.props.state.verifyCode)) {
            axios.post(`api/${role}/login?phone=` + this.props.state.phone)
                .then((resp) => {
                    console.log(resp)
                    window.localStorage.setItem("token", resp.data.token);
                    window.location.reload();
                }).catch((error) => {
                    console.error(error);
                })
        } else {
            window.alert('Verification code is invalid. Please try again.')
        }
    }


    render() {
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
                        />
                    </InputGroup>
                    <p>We sent a 4 digit confirmation code to<br />
                        {this.props.state.phone}<br />
                        You should get it in a few seconds</p>

                    <Button variant='success' size='lg' onClick={this.login.bind(this)}>
                        Continue
                </Button>
                </div>
            </ReactCSSTransitionGroup>
        )
    }
}
