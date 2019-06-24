import React, { Component } from 'react'
import jwt_decode from 'jwt-decode'
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import Form from "react-bootstrap/Form";
import { NotificationContainer, NotificationManager } from "react-notifications";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


export default class ContactUs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            decoded: ''
        }
    }

    componentDidMount() {
        const loginToken = window.localStorage.getItem("token");
        if (loginToken) {
            this.setState({ decoded: jwt_decode(loginToken) })
        }
    }


    sendInquiry() {
        axios.post(`api/customers/contact-us?email=${this.state.decoded.email}&message=${this.state.message}`)
            .then(resp => {
                console.log(resp)
                if (resp.data.success) this.success.click()
                else this.error.click()
            })
            .catch(err => {
                console.error(err)
            })
    }

    enterPressed(event) {
        if (this.state.message) {
            var code = event.keyCode || event.which;
            if (code === 13) {
                this.sendInquiry()
            }
        }
    }

    createNotification = type => {
        return () => {
            switch (type) {
                case 'success':
                    NotificationManager.success('Request submitted successfully', 'Message sent', 2500)
                    break;
                case "error":
                    NotificationManager.error('Your request has not been submitted', 'Error sending message', 2500);
                    break;
            };
        }
    }


    render() {

        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>

                <div style={{ borderBottom: '1px solid #ebecef' }}>
                    <div className='center' style={{ margin: '75px auto' }}>
                        <h1 style={{ fontSize: 48, margin: 0 }}>Contact Us</h1>
                        <p style={{ fontSize: 16, color: '#88898c' }}>Here you can contact Swiply administration for an issue you're having</p>
                    </div>
                </div>
                <div style={{ background: 'linear-gradient(180deg, #EDF0F4 0%, #FFFFFF 65.24%, #FFFFFF 100%)', padding: 25 }}>
                    <div className='center'>
                        <Form.Group>
                            <Form.Label>What can we help you with?</Form.Label>
                            <Form.Control
                                as='textarea'
                                rows={5}
                                placeholder='Please enter your request here'
                                onChange={(e) => this.setState({ message: e.target.value })}
                                style={{ width: '70%', margin: '0 auto' }}
                                onKeyPress={this.enterPressed.bind(this)}

                            />
                        </Form.Group>

                        <Button onClick={this.sendInquiry.bind(this)} disabled={!this.state.message} variant='success' size='lg'>
                            Submit
                    </Button>
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

                <NotificationContainer />

            </ReactCSSTransitionGroup>

        )
    }
}