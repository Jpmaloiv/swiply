import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import axios from 'axios'
import jwt_decode from 'jwt-decode'

import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default class AccountSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {}
        }
    }

    componentWillMount() {
        this.fetchUser();
    }

    fetchUser() {
        const loginToken = window.localStorage.getItem("token");
        let decoded = ''
        if (loginToken) decoded = jwt_decode(loginToken)

        let role = ''
        if (decoded.role === 'user') role = 'users'
        if (decoded.role === 'customer') role = 'customers'
        this.setState({ role: decoded.role })

        axios.get(`/api/${role}/search?id=` + decoded.id)
            .then((resp) => {
                console.log(resp)
                this.setState({
                    user: resp.data.response[0],
                    S3_BUCKET: resp.data.bucket
                }, this.imageCheck)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    imageCheck() {
        const { user } = this.state
        if (user.imageLink) {
            user.imageLink = `https://s3-us-west-1.amazonaws.com/${this.state.S3_BUCKET}/${user.imageLink}`
            this.setState({ render: !this.state.render })
        }
    }

    // Handles user input
    handleChange = e => {
        this.state.user[e.target.name] = e.target.value
    };

    // Preview image once seleted
    onImageChange = e => {
        const file = e.target.files[0]
        if (file) {
            this.state.user.imageLink = URL.createObjectURL(file);
            this.setState({
                file: file,
                fileName: file.name,
                fileType: file.type
            })
        }
    }

    createNotification = (type) => {
        return () => {
            switch (type) {
                case 'success':
                    NotificationManager.success('Account updated', '', 2500);
                    break;
                case 'error':
                    NotificationManager.error('Error updating account', '', 2500);
                    break;
            }
        };
    };

    // Updates user with any changes made
    updateUser() {
        const { user } = this.state;

        let role = ''
        if (this.state.role === 'user') role = 'users'
        if (this.state.role === 'customer') role = 'customers'

        // let file = page.file
        // // Split the filename to get the name and type
        // let fileParts = file.name.split('.');
        // let fileName = fileParts[0];
        // let fileType = fileParts[1];
        // console.log("Preparing the upload", file);
        let data = new FormData();
        data.append("imgFile", this.state.file)
        axios.put(`/api/${role}/update?id=` + this.state.user.id + '&firstName=' + user.firstName + '&lastName=' + user.lastName + '&title=' + user.title + '&phone=' + user.phone +
            '&email=' + user.email + '&summary=' + user.summary, data)
            .then(res => {
                console.log(res)
                this.success.click();
                this.fetchUser();
            }).catch(err => {
                console.error(err);
                this.error.click();
            })
    }


    render() {

        const { role, user } = this.state
        console.log(this.state)

        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
                <div>
                    <div className='center' style={{ textAlign: 'initial' }}>
                        <h2 style={{ textAlign: 'center' }}>Account Settings</h2>

                        <Form style={{ padding: '25px 75px' }}>
                            <div className='profilePic'>
                                {user.imageLink ?
                                    <div>
                                        <img src={user.imageLink} style={{ width: 75, height: 75, borderRadius: '50%', objectFit: 'cover' }} alt='' />
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
                            {user.imageLink ? <span></span> : <p style={{ fontSize: 12, textAlign: 'center', marginTop: '.5rem' }}>Add Profile Image</p>}

                            <Form.Group>
                                <input type='file' name='imgFile' ref={(ref) => this.upload = ref} onChange={this.onImageChange} style={{ display: 'none' }} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    placeholder={user.firstName}
                                    name='firstName'
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    placeholder={user.lastName}
                                    name='lastName'
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            {role === 'user' ?
                                <Form.Group>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        placeholder={user.title}
                                        name='title'
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                :
                                <span></span>
                            }
                            <Form.Group>
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    placeholder={user.phone}
                                    name='phone'
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    placeholder={user.email}
                                    name='email'
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            
                            {role === 'user' ?
                                <Form.Group>
                                    <Form.Label>Profile Summary</Form.Label>
                                    <Form.Control
                                        as='textarea'
                                        placeholder={user.summary}
                                        name='summary'
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                :
                                <span></span>
                            }
                        </Form>
                    </div>

                    <Button
                        variant='success'
                        size='lg'
                        style={{ display: 'block' }}
                        onClick={this.updateUser.bind(this)}
                    >
                        Update Account
                    </Button>
                </div>

                <button className='btn btn-success' onClick={this.createNotification('success')} ref={(ref) => this.success = ref} style={{ display: 'none' }}>Success</button>
                <button className='btn btn-danger' onClick={this.createNotification('error')} ref={(ref) => this.error = ref} style={{ display: 'none' }}>Error</button>
                <NotificationContainer />
            </ReactCSSTransitionGroup>
        )
    }
}