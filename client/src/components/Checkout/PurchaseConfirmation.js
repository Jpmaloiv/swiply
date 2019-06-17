import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import axios from 'axios'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Button from 'react-bootstrap/Button'
import Form from "react-bootstrap/Form";


export default class PurchaseConfirmation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            complete: false
        }
    }

    enterPressed(event) {
        // if (user.email && user.password && user.confirmpw) {
        var code = event.keyCode || event.which;
        if (code === 13) {
            console.log("hi for now")
        }
    }

    // Register the new customer
    register() {

        axios.post(`api/customers/register?password=${this.state.password}&token=${window.localStorage.getItem('stripeToken')}
        &accountId=${window.localStorage.getItem('accountId')}&price=${window.localStorage.getItem('price')}`)
            .then((resp) => {
                console.log(resp)
                window.localStorage.setItem("token", resp.data.token);
                this.setState({ complete: true})
                // window.location = '/checkout'
            }).catch((error) => {
                console.error(error);
            })
    }

    render() {
        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
                <div className='center'>
                    {!this.state.complete ?
                        <div>
                            <h6>Please enter a password which you'll use to log in and view the content you've purchased.</h6><br />
                            <Form.Group>
                                <Form.Control
                                    placeholder='Enter New Password'
                                    onChange={(e) => this.setState({ password: e.target.value })}
                                    style={{ width: '70%', margin: '0 auto' }}
                                    type='password'
                                    onKeyPress={this.enterPressed.bind(this)}
                                />
                            </Form.Group>
                            <Button variant='success' size='lg' onClick={this.register.bind(this)}>
                                Register
                            </Button>
                        </div>
                        :
                        <div>
                            <h1>Congratulations</h1> <br />
                            <h5>You now have access to the page <br /><b>{window.localStorage.getItem('page')}</b></h5>
                            <img src={require(`../../images/congrats.jpg`)} style={{ width: '100%', opacity: .6 }} alt='Welcome' />

                            <NavLink to={`/pages/${window.localStorage.getItem('pageId')}`}>
                                <Button variant='success' size='lg'>
                                    Go to Page
                                </Button>
                            </NavLink>
                        </div>
                    }
                </div>
            </ReactCSSTransitionGroup>
        )
    }
}