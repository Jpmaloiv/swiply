import React, { Component } from 'react';
import axios from 'axios'
import jwt_decode from 'jwt-decode'

import Button from 'react-bootstrap/Button'

import {
  CardElement,
  injectStripe,
  StripeProvider,
  Elements,
} from 'react-stripe-elements';


// You can customize your Elements to give it the look and feel of your site.
const createOptions = () => {
  return {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        fontFamily: 'Open Sans, sans-serif',
        letterSpacing: '0.025em',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#c23d4b',
      },
    }
  }
};

class _CardForm extends Component {
  state = {
    page: '',
    errorMessage: '',
  };

  componentWillMount() {
    const loginToken = window.localStorage.getItem("token");
    if (loginToken) this.setState({ decoded: jwt_decode(loginToken) })
    if (window.localStorage.getItem('customer')) {
      axios.get('/api/pages/search?pageId=' + window.localStorage.getItem('pageId'))
        .then((resp) => {
          console.log(resp)
          this.setState({
            page: resp.data.response[0],
            customer: true,
            s3Bucket: resp.data.bucket
          })
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

  handleChange = ({ error }) => {
    if (error) {
      this.setState({ errorMessage: error.message });
    }
  };

  handleSubmit = (evt) => {
    evt.preventDefault();
    console.log(this.props, this.state)
    if (this.props.stripe) {
      this.props.stripe.createToken().then(this.props.handleResult);

      axios.post(`api/auth/page?customerId=${this.state.decoded.id}&pageId=${window.localStorage.getItem('pageId')}`)
        .then((resp) => {
          console.log(resp)
          window.location = '/purchased'
        }).catch((error) => {
          console.error(error);
        })
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  };

  render() {

    const { page } = this.state

    return (
      <div className='center'>
        <div className="CardDemo">
          <form onSubmit={this.handleSubmit.bind(this)} style={{paddingBottom: 0}}>
            <label style={{ width: 250 }}>
              Card details
            <CardElement
                onChange={this.handleChange}
                {...createOptions()}
              />
            </label>
            <div className="error" role="alert">
              {this.state.errorMessage}
            </div>
            <Button variant='success' onClick={this.handleSubmit}>Pay</Button>
          </form>
        </div>

        {this.state.customer ?
          <div style={{ textAlign: 'center' }}>
            <div className='page' style={{ display: 'flex', flex: 'initial', margin: '1em auto' }}>
              <img src={`https://s3-us-west-1.amazonaws.com/${this.state.s3Bucket}/${page.imageLink}`} style={{ width: 75, objectFit: 'cover', marginRight: 20 }} />
              <div style={{ width: '100%', textAlign: 'left' }}>
                <h4>{page.name}</h4>
                <p>{page.description}</p>
              </div>
              <div>${page.price}</div>
            </div>
          </div>
          :
          <span></span>
        }
      </div>
    );
  }
}

const CardForm = injectStripe(_CardForm);

export default class CardDemo extends Component {
  render() {
    console.log(this.props)
    return (
      <div className='form'>
        <CardForm handleResult={this.props.handleResult} />
      </div>
    );
  }
}