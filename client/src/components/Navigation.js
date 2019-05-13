import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import jwt_decode from 'jwt-decode'



export default class Navigation extends Component {


    logout() {
        if (window.confirm('Would you like to log out of PV3?')) {
            window.localStorage.removeItem('token')
            window.location = '/'
        } else {
            return;
        }
    }


    render() {
        // let profile = ''
        // if (this.props.decoded.profile) profile = this.props.decoded.profile
        // if (!this.props.decoded.profile) profile = this.props.decoded.id

        return (
            <header>
                <div>
                    <NavLink to='/'>
                        <img
                            src={require(`../images/pv3_logo.png`)}
                            style={{ width: 150 }}
                            alt='PV3'
                        />
                    </NavLink>
                </div>
                {this.props.decoded ?
                    <div className='navigation'>
                        <NavLink to='/dashboard'>
                            Dashboard
                        </NavLink>
                        <NavLink to='/sales'>
                            Sales
                        </NavLink>
                        <NavLink to='/customers'>
                            Customers
                        </NavLink>
                        <NavLink to={`/profile/edit/${this.props.decoded.id}`}>
                            Public Profile
                        </NavLink>
                        <NavLink to={`/account/${this.props.decoded.id}`}>
                            <FontAwesomeIcon icon='user' />My Account
                        </NavLink>
                        <NavLink to='/' onClick={this.logout}>
                            <FontAwesomeIcon icon='sign-out-alt' />Sign out
                        </NavLink>
                    </div>
                    :
                    <div>
                        {this.props.login ?
                            <div className='link' onClick={() => this.props.setState({ login: false })}>Register</div>
                            :
                            <div className='link' onClick={() => this.props.setState({ login: true })}>Sign In</div>
                        }
                    </div>
                }
            </header>
        )
    }
}