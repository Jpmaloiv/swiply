import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import axios from 'axios'
import jwt_decode from 'jwt-decode'

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
        const loginToken = window.localStorage.getItem("token");
        let decoded = ''
        if (loginToken) decoded = jwt_decode(loginToken)

        axios.get('/api/users/search?id=' + decoded.id)
            .then((resp) => {
                console.log(resp)
                this.setState({
                    user: resp.data.response[0],
                    image: `https://s3-us-west-1.amazonaws.com/${resp.data.bucket}/${resp.data.response[0].imageLink}`,
                    S3_BUCKET: resp.data.bucket
                })
            })
            .catch((error) => {
                console.error(error)
            })
    }

    // Handles user input
    handleChange = e => {
        this.state.user[e.target.name] = e.target.value
    };

    // Preview image once seleted
    onImageChange = e => {
        const file = e.target.files[0]
        this.setState({
            image: URL.createObjectURL(file),
            file: file,
            fileName: file.name,
            fileType: file.type
        })
    }

    // Updates user with any changes made
    updateUser() {
        const { user } = this.state;
        console.log(user)

        // let file = page.file
        // // Split the filename to get the name and type
        // let fileParts = file.name.split('.');
        // let fileName = fileParts[0];
        // let fileType = fileParts[1];
        // console.log("Preparing the upload", file);
        let data = new FormData();
        data.append("imgFile", this.state.file)
        axios.put('/api/users/update?id=' + this.state.user.id + '&firstName=' + user.firstName + '&lastName=' + user.lastName + '&title=' + user.title + '&phone=' + user.phone +
            '&email=' + user.email + '&summary=' + user.summary, data)
            .then(res => {
                console.log(res)
                window.location.reload();
            }).catch(err => {
                console.error(err);
            })
    }


    render() {

        const { user } = this.state
        console.log(this.state)
        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
                <div>
                    <div className='center' style={{ textAlign: 'initial' }}>
                        <h2 style={{ textAlign: 'center' }}>Account Settings</h2>

                        <Form style={{ padding: '25px 75px' }}>
                            <div className='profilePic'>
                                {this.state.image ?
                                    <div>
                                        <img src={this.state.image} style={{ width: 75, height: 75, borderRadius: '50%', objectFit: 'cover' }} alt='' />
                                        <FontAwesomeIcon
                                            icon='plus'
                                            style={{ opacity: .2, position: 'absolute' }}
                                            onClick={() => { this.upload.click() }}
                                        />
                                    </div>
                                    :
                                    <FontAwesomeIcon
                                        icon='plus'
                                        size='2x'
                                        style={{ opacity: .2 }}
                                        onClick={() => { this.upload.click() }}
                                    />
                                }
                            </div>
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
                            <Form.Group>
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    placeholder={user.title}
                                    name='title'
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
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
                            <Form.Group>
                                <Form.Label>Profile Summary</Form.Label>
                                <Form.Control
                                    as='textarea'
                                    placeholder={user.summary}
                                    name='summary'
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
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
            </ReactCSSTransitionGroup>
        )
    }
}