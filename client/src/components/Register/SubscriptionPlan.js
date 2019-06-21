import axios from "axios";
import React, { Component } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Spinner from 'react-bootstrap/Spinner'
import StripeCheckout from 'react-stripe-checkout'


export default class SubscriptionPlan extends Component {
  constructor(props) {
    super(props)
    this.state = {
      plan: 'medium',
      stripePublishableKey: '',
      submit: false
    }
  }

  // Register the new user
  register(token) {
    this.setState({ submit: true })

    const user = this.props.state;

    if (user.password === user.confirmpw) {
      let data = new FormData();
      data.append("imgFile", user.file);

      axios.post(`api/users/register?firstName=${user.firstName}&lastName=${user.lastName}&email=${user.email}
      &password=${user.password}&title=${user.title}&profile=${user.profile}&summary=${user.summary}&token=${token.id}&plan=${this.state.plan}`, data)
        .then(resp => {
          console.log(resp);
          window.localStorage.setItem("token", resp.data.token);
          window.localStorage.setItem('userId', resp.data.userId)
          this.props.setState({ view: 'PaymentIntegration' })
        })
        .catch(error => {
          console.error(error);
        });
    }
  }


  render() {

    const { plan } = this.state

    return (
      <ReactCSSTransitionGroup
        transitionName="fade"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnter={false}
        transitionLeave={false}
      >
        <div className="center">
          <ButtonGroup vertical name='subscription' className='subscription-plan'>
            <Button variant="light" active={plan === 'small'} onClick={() => this.setState({ plan: 'small' })}>
              <h4>Bronze Plan</h4>
              <p>
                If you're new to your craft or content creation this is
                a good first step. Get your feet wet and check it out.
              </p>
              <h4>FREE</h4>
            </Button>
            <Button variant="light" active={plan === 'medium'} onClick={() => this.setState({ plan: 'medium' })}>
              <h4>Silver Plan</h4>
              <p>
                If you've got some momentum with what you do
                and are gaining traction with your audience.
              </p>
              <h4>$199.<sup style={{ fontSize: '60%' }}>95</sup> / <span style={{ fontSize: 16 }}>mnth</span></h4>
            </Button>
            <Button variant="light" active={plan === 'pro'} onClick={() => this.setState({ plan: 'pro' })}>
              <h4>Gold Plan</h4>
              <p>
                You've been a pro for many years and are simply
                looking for the platform that's right for you.
              </p>
              <h4>$399.<sup style={{ fontSize: '60%' }}>95</sup> / <span style={{ fontSize: 16 }}>mnth</span></h4>
            </Button>
          </ButtonGroup>

          {!this.state.submit ?
            <div>
              <StripeCheckout
                token={this.register.bind(this)}
                stripeKey='pk_test_f3sdsuRefwIEyWwwg1LKClVY006I3NL4t9'
                name='Swiply'
                description={'Subscription Plan'}
                opened={() => window.alert('Please click top left yellow button for test numbers')}
                email={this.props.state.email}
                image='https://cdn0.iconfinder.com/data/icons/galaxy-open-line-gradient-iii/200/internet-browser-512.png'
                currency='USD'
                allowRememberMe={false}
              >
                {plan !== 'small' ?
                  <Button variant='success' size='lg'>
                    Select Plan
                  </Button>
                  :
                  <span></span>
                }
              </StripeCheckout>

              {plan === 'small' ?
                <Button onClick={this.register.bind(this)} variant='success' size='lg'>
                  Continue
                </Button>
                :
                <span></span>
              }
            </div>
            :
            <Button variant='success' className='loading' disabled>
              <Spinner
                as="span"
                animation="grow"
              />
              Registering...
            </Button>
          }

        </div>
      </ReactCSSTransitionGroup>
    );
  }
}
