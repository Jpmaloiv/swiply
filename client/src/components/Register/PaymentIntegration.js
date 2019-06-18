import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import crypto from 'crypto'
import axios from 'axios'
import Button from 'react-bootstrap/Button'


export default class PaymentIntegration extends Component {
    constructor(props) {
        super(props)
        this.state = {
            token: crypto.randomBytes(64).toString('hex')
        }
    }

    componentWillMount() {
        axios.get('api/env')
            .then(resp => {
                console.log(resp)
                this.setState({
                    baseUrl: resp.data.baseUrl,
                    stripeClientId: resp.data.stripeClientId,
                    stripePublishableKey: resp.data.stripePublishableKey
                })
            }).catch(err => {
                console.error(err)
            })
    }

    render() {

        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
                <div style={{ borderBottom: '1px solid #ebecef' }}>
                    <div className='center'>
                        <h1 style={{ fontSize: 48 }}>Payment Integration</h1>
                        <p style={{ fontSize: 16, color: '#88898c' }}>In order to charge for your content, you'll need to set up a payment method
                        to collect your payments.</p>
                    </div>
                </div>
                <div style={{ background: 'linear-gradient(180deg, #EDF0F4 0%, #FFFFFF 65.24%, #FFFFFF 100%)' }}>
                    <div className='main' style={{ margin: '0 auto', padding: 25 }}>
                        <div className='page' style={{ display: 'flex', width: 'initial', height: 135, maxWidth: 1036, margin: '20px auto', alignItems: 'center', background: '#fff' }}>
                            <img src={require(`../../images/stripe.png`)} style={{ margin: 20, width: 95, height: 95, borderRadius: 5 }} />
                            <p style={{ fontSize: 16, color: '#68696b', margin: 20 }}>Stripe is the best software platform for running an internet business. We handle billions of dollars
                                every year for forward-thinking businesses around the world.
                        </p>
                            <Button
                                className='connect'
                                variant='outline-secondary'
                                style={{ width: 252, height: 55, border: '1px solid #e6e7ea', color: '#1b1c1c' }}
                                onClick={() => window.open(`https://connect.stripe.com/express/oauth/authorize?client_id=${this.state.stripeClientId}&state=${this.state.token}
                                &redirect_uri=${this.state.baseUrl}/welcome`)}
                            >Connect Now
                        </Button>
                        </div>
                        <Button variant='link' onClick={() => window.location.reload()} style={{ display: 'block', textDecoration: 'underline', borderBottom: 'none' }}>
                            <span style={{ fontSize: 20 }}>Skip it, I'll do this later.</span>
                        </Button>
                    </div>
                </div>
            </ReactCSSTransitionGroup >
        )
    }
}
