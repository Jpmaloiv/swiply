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
          this.props.setState({ view: 'PaymentIntegration'})
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
              <h4>Small Plan</h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <h4>$0 Per Month</h4>
            </Button>
            <Button variant="light" active={plan === 'medium'} onClick={() => this.setState({ plan: 'medium' })}>
              <h4>Medium Plan</h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <h4>$199 Per Month</h4>
            </Button>
            <Button variant="light" active={plan === 'pro'} onClick={() => this.setState({ plan: 'pro' })}>
              <h4>Pro Plan</h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <h4>$399 Per Month</h4>
            </Button>
          </ButtonGroup>

          {!this.state.submit ?
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
              <Button variant='success' size='lg'>
                Pay with Card
              </Button>
            </StripeCheckout>
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
