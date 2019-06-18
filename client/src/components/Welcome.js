import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import jwt_decode from 'jwt-decode'


export default class Welcome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: ''
        }
    }

    componentWillMount() {
        const loginToken = window.localStorage.getItem("token");
        if (loginToken) this.setState({ decoded: jwt_decode(loginToken) }, () => console.log(this.state.decoded))


        if (this.props.location.search) {
            let params = this.props.location.search.replace('?code=', '').split('&state=')
            this.setState({
                loading: true,
                accessToken: params[0]
            })

            axios.get('api/env')
                .then(resp => {
                    console.log(resp)
                    this.setState({
                        stripeSecretKey: resp.data.stripeSecretKey
                    }, this.getLoginLink)
                }).catch(err => {
                    console.error(err)
                })
        }
    }

    getLoginLink() {
        axios.post(`api/stripe/register?id=${window.localStorage.getItem('userId')}
            &client_secret=${this.state.stripeSecretKey}&code=${this.state.accessToken}`)
            .then((resp) => {
                if (resp.data.success == true) this.setState({ loading: false})
            }).catch((error) => {
                console.error(error);
            })
    }

    render() {

        console.log(this.state)
        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
                <div className='center'>
                    {this.state.loading ?
                        <div>
                            <Spinner animation="border" variant="success" /><br />
                            <h4>Finishing registration...</h4>
                        </div>
                        :
                        <div>
                            <h1>Welcome to Swiply</h1><br />
                            <h5>Congratulations, you're just a few steps away from getting paid for your content.</h5>
                            <img src={require(`../images/welcome.png`)} style={{ width: '100%', opacity: .6 }} alt='Welcome' />

                            <NavLink to='/pages/add'>
                                <Button variant='success' size='lg'>
                                    Create Your First Page
                        </Button>
                            </NavLink>
                        </div>
                    }
                </div>
            </ReactCSSTransitionGroup>
        )
    }
}