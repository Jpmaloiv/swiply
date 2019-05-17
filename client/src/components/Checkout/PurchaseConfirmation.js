import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Button from 'react-bootstrap/Button'


export default class PurchaseConfirmation extends Component {

    render() {
        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
                <div className='center'>
                    <h1>Congratulations</h1><br />
                    <h5>You now have access to the page <br /><b>{window.localStorage.getItem('page')}</b></h5>
                    <img src={require(`../../images/congrats.jpg`)} style={{ width: '100%', opacity: .6 }} alt='Welcome' />

                    <NavLink to={`/pages/${window.localStorage.getItem('pageId')}`}>
                        <Button variant='success' size='lg'>
                            Go to Page
                        </Button>
                    </NavLink>
                </div>
            </ReactCSSTransitionGroup>
        )
    }
}