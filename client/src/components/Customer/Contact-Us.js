import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Form from "react-bootstrap/Form";
import { NotificationContainer, NotificationManager } from "react-notifications";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


export default class ContactUs extends Component {


    sendInquiry() {
        axios.post(`api/customers/contact-us?message=${this.state.message}`)
            .then(resp => {
                console.log(resp)
                this.success.click();
            })
            .catch(err => {
                console.error(err)
                this.error.click();
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
                <div style={{ background: 'linear-gradient(180deg, #EDF0F4 0%, #FFFFFF 65.24%, #FFFFFF 100%)' }}>
                    <Form.Group>
                        <Form.Control
                            as='textarea'
                            placeholder='Please enter your request here'
                            onChange={(e) => this.setState({ message: e.target.value })}
                            style={{ width: '70%', margin: '0 auto' }}
                            onKeyPress={this.enterPressed.bind(this)}

                        />
                    </Form.Group>

                    <Button onClick={this.sendInquiry} variant='success' size='lg'>
                        Submit
                    </Button>
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