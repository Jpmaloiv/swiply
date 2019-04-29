import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Button from 'react-bootstrap/Button'


export default class Welcome extends Component {

    render() {
        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
                <div className='center'>
                    <h1>Welcome to PV3</h1><br />
                    <h5>Congratulations, you're just a few steps away from getting paid for your content.</h5>
                    <img src={require(`../images/welcome.png`)} style={{ width: '100%', opacity: .6 }} alt='Welcome' />

                    <NavLink to='/pages/add'>
                        <Button variant='dark' size='lg'>
                            Create Your First Page
                        </Button>
                    </NavLink>
                </div>
            </ReactCSSTransitionGroup>
        )
    }
}