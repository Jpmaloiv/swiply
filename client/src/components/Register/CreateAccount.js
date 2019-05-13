import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import axios from 'axios'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default class CreateAccount extends Component {

    // Checks to see if user is a customer who requested page access
    componentDidMount() {
        if (window.localStorage.getItem('customer')) {
            this.setState({ 
                customer: true
            })
        }
    }

    /* Sends a verification code via SMS */
    verifyPhone() {
        axios.post('api/auth/send?phone=' + this.props.state.phone)
            .then((resp) => {
                console.log(resp)
                // Sets the verification code and switches to the Verify Account screen
                this.props.setState({
                    verifyCode: resp.data.verifyCode,
                    view: 'VerifyAccount'
                })
            }).catch((error) => {
                console.error(error);
            })
    }

    // Handle user input
    handleChange = e => {
        this.props.setState({ [e.target.name]: e.target.value });
    };

    // Preview image once seleted
    onImageChange = e => {
        const file = e.target.files[0]
        if (file) {
            this.props.setState({
                image: URL.createObjectURL(file),
                file: file,
                fileName: file.name,
                fileType: file.type
            })
        }
    }


    render() {

        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
                <div className='center'>
                    <h2>Create Account</h2><br />
                    <Form className='login'>
                        <Form.Group>
                            <input type='file' name='imgFile' ref={(ref) => this.upload = ref} onChange={this.onImageChange} style={{ display: 'none' }} />
                            <div className='profilePic'>
                                {this.props.state.image ?
                                    <div>
                                        <img src={this.props.state.image} style={{ width: 75, height: 75, borderRadius: '50%', objectFit: 'cover' }} alt='' />
                                        <FontAwesomeIcon
                                            icon='user-plus'
                                            style={{ opacity: .2, position: 'absolute' }}
                                            onClick={() => { this.upload.click() }}
                                        />
                                    </div>
                                    :
                                    <FontAwesomeIcon
                                        icon='user-plus'
                                        size='2x'
                                        color='white'
                                        style={{ opacity: .8 }}
                                        onClick={() => { this.upload.click() }}
                                    />
                                }
                            </div>
                            {this.props.state.image ? <span></span> : <p style={{ fontSize: 12, marginTop: '.5rem' }}>Add Profile Image</p>}
                        </Form.Group>
                        <Form.Group>
                            <Form.Control
                                placeholder='First Name'
                                name='firstName'
                                onChange={this.handleChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control
                                placeholder='Last Name'
                                name='lastName'
                                onChange={this.handleChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control
                                placeholder='Email Address'
                                name='email'
                                onChange={this.handleChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control
                                placeholder='Phone Number'
                                name='phone'
                                onChange={this.handleChange}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Check type='checkbox' label='Remember me' />
                        </Form.Group>
                    </Form>

                    <Button variant='success' size='lg' onClick={this.verifyPhone.bind(this)}>
                        Continue
                    </Button>
                </div>
            </ReactCSSTransitionGroup>
        )
    }
}