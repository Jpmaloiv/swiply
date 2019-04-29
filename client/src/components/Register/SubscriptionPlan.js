import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import axios from 'axios'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'


export default class SubscriptionPlan extends Component {

    // Register the new user
    register() {
        const user = this.props.state;
        let data = new FormData();
        data.append("imgFile", user.file)
        axios.post('api/users/register?firstName=' + user.firstName + '&lastName=' + user.lastName + '&email=' + user.email +
            '&phone=' + user.phone + '&summary=' + user.summary, data)
            .then((resp) => {
                console.log(resp)
                window.localStorage.setItem("token", resp.data.token);
                window.location.reload();
            }).catch((error) => {
                console.error(error);
            })
    }

    render() {
        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
                <div className='center'>
                    <ButtonGroup vertical>
                        <Button variant='light'>
                            <h4>Small Plan</h4>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            <h4>$0 Per Month</h4>
                        </Button>
                        <Button variant='light'>
                            <h4>Medium Plan</h4>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            <h4>$199 Per Month</h4>
                        </Button>
                        <Button variant='light'>
                            <h4>Pro Plan</h4>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            <h4>$399 Per Month</h4>
                        </Button>
                    </ButtonGroup>

                    <Button variant='dark' size='lg' onClick={this.register.bind(this)}>
                        Register
                </Button>
                </div>
            </ReactCSSTransitionGroup>
        )
    }
}
