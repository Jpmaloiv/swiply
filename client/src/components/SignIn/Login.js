import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import axios from 'axios'

import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'


export default class Login extends Component {


    // Handle user input
    handleChange = e => {
        this.props.setState({ [e.target.name]: e.target.value });
    };

    verifyPhone() {
        axios.post('api/auth/verify?phone=' + this.props.state.phone)
            .then((resp) => {
                console.log(resp)
                if (resp.data.success === true) {
                    // Sets the verification code and switches to the Verify Account screen
                    this.props.setState({
                        verifyCode: resp.data.verifyCode,
                        view: 'VerifyAccount'
                    })
                } else {
                    window.alert('Invalid phone number. Please try again');
                }
            }).catch((error) => {
                console.error(error);
            })
    }

    render() {
        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
                <div className='center'>
                    <h3>Welcome Back</h3>
                    <InputGroup>
                        <FormControl
                            className='verificationInput'
                            placeholder='+1 000 000 0000'
                            name='phone'
                            onChange={this.handleChange}
                        />
                    </InputGroup>
                    <p>Please enter your phone number to sign in.</p>

                    <Button variant='success' size='lg' onClick={this.verifyPhone.bind(this)}>
                        Continue
                </Button>
                </div>
            </ReactCSSTransitionGroup>
        )
    }
}
