import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import axios from 'axios'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'


export default class Login extends Component {
    x


    // Handle user input
    handleChange = e => {
        console.log(e.target)
        this.props.setState({ [e.target.name]: e.target.value });
    };

    verifyPhone() {
        axios.post(`api/auth/verify?phone=${this.props.state.phone}&role=${this.props.state.role}`)
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
                    <h2>Login</h2>
                    <ButtonGroup style={{ width: '100%' }}>
                        <Button
                            variant='link'
                            active={this.props.state.role === 'user'}
                            onClick={() => this.props.setState({ role: 'user' })}
                        >
                            Content Provider
                        </Button>
                        <Button
                            variant='link'
                            active={this.props.state.role === 'customer'}
                            onClick={() => this.props.setState({ role: 'customer' })}
                        >
                            Customer
                        </Button>
                    </ButtonGroup>
                    <br />
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
