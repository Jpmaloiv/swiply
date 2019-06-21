import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import jwt_decode from "jwt-decode";

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Button from 'react-bootstrap/Button'
import Form from "react-bootstrap/Form";
import Spinner from 'react-bootstrap/Spinner'


export default class PurchaseConfirmation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            complete: false
        }
    }

    componentWillMount() {
        const loginToken = window.localStorage.getItem("token");
        if (loginToken) {
            this.setState({
                loading: true,
                decoded: jwt_decode(loginToken)
            }, this.purchasePage)
        }
    }

    enterPressed(event) {
        if (this.state.email && this.state.password) {
            var code = event.keyCode || event.which;
            if (code === 13) {
                this.register()
            }
        }
    }

    // Purchase the page if an existing customer
    async purchasePage() {
        await axios.post(`api/stripe/charge?token=${window.localStorage.getItem('stripeToken')}&id=${this.state.decoded.id}
        &accountId=${window.localStorage.getItem('accountId')}&price=${window.localStorage.getItem('price')}&pageId=${window.localStorage.getItem('pageId')}`)
            .then((resp) => {
                console.log(resp)
            }).catch((error) => {
                console.error(error);
            })

        axios.post(`api/auth/page?customerId=${this.state.decoded.id}&pageId=${window.localStorage.getItem("pageId")}`)
            .then(resp => {
                console.log(resp);
                this.setState({ complete: true, loading: false })
                let token = localStorage.getItem('token');
                localStorage.clear();
                localStorage.setItem('token', token);
            })
            .catch(error => {
                console.error(error);
            })
    }

    // Register the new customer and grant initial page access
    async register() {
        this.setState({ loading: true })
        const customerId = await axios.post(`api/customers/register?email=${this.state.email}&password=${this.state.password}&token=${window.localStorage.getItem('stripeToken')}
        &accountId=${window.localStorage.getItem('accountId')}&price=${window.localStorage.getItem('price')}&pageId=${window.localStorage.getItem('pageId')}`)
            .then((resp) => {
                console.log(resp)
                window.localStorage.setItem("token", resp.data.token);
                return resp.data.customerId
            }).catch((error) => {
                console.error(error);
            })

        axios.post(`api/auth/page?customerId=${customerId}&pageId=${window.localStorage.getItem("pageId")}`)
            .then(resp => {
                console.log(resp);
                this.setState({ complete: true, loading: false })
                let token = localStorage.getItem('token');
                localStorage.clear();
                localStorage.setItem('token', token);
            })
            .catch(error => {
                console.error(error);
            })
    }

    render() {
        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
                <div className='center'>
                    {!this.state.complete ?
                        <div>
                            {!this.state.decoded ?
                                <div>
                                    <h6>Please enter information which you'll use to log in and view the content you've purchased.</h6><br />
                                    <Form.Group>
                                        <Form.Control
                                            placeholder='Enter Email'
                                            onChange={(e) => this.setState({ email: e.target.value })}
                                            style={{ width: '70%', margin: '0 auto' }}
                                            onKeyPress={this.enterPressed.bind(this)}

                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Control
                                            placeholder='Enter Password'
                                            onChange={(e) => this.setState({ password: e.target.value })}
                                            style={{ width: '70%', margin: '0 auto' }}
                                            type='password'
                                            onKeyPress={this.enterPressed.bind(this)}
                                        />
                                    </Form.Group>
                                </div>
                                :
                                <span></span>
                            }
                            {!this.state.loading ?
                                <Button variant='success' size='lg' onClick={this.register.bind(this)} disabled={!this.state.email || !this.state.password}>
                                    Register
                                </Button>
                                :
                                <div>
                                    {!this.state.decoded ?
                                        <Button variant='success' className='loading' disabled style={{ display: 'inline-block' }}>
                                            <Spinner
                                                as="span"
                                                animation="grow"
                                            />
                                            Registering...
                                </Button>
                                        :
                                        <Spinner animation="border" variant="success" />
                                    }
                                </div>
                            }
                        </div>
                        :
                        <div>
                            <h1>Congratulations</h1> <br />
                            <h5>You now have access to the page <br /><b>{window.localStorage.getItem('page')}</b></h5>
                            <img src={require(`../../images/congrats.png`)} style={{ width: '100%', opacity: .6 }} alt='Welcome' />

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