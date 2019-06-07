import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { slide as Menu } from 'react-burger-menu'


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

        const { role } = this.props.decoded
        console.log(this.props.decoded)

        return (
            <header>
                <div>
                    <NavLink to='/'>
                        {/* <img
                            src={require(`../images/pv3_logo.png`)}
                            style={{ width: 150 }}
                            alt='PV3'
                        /> */}
                        <h1 style={{color: '#333', margin: '0 30px'}}>Swiply</h1>
                    </NavLink>
                </div>
                {this.props.decoded ?
                    <div style={{height: '100%'}}>
                        <div className='navigation' style={{height: '100%'}}>
                            {role === 'user' ?
                                <div style={{display: 'inherit'}}>
                                    <NavLink to='/' exact={true}>
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
                                </div>
                                :
                                <span></span>
                            }
                            <NavLink to={`/account/${this.props.decoded.id}`}>
                                <FontAwesomeIcon icon='user' />My Account
                            </NavLink>
                            {role === 'customer' ?
                                <div style={{display: 'inherit'}}>
                                    <NavLink to='/purchases'>
                                        My Purchases
                                    </NavLink>
                                    <NavLink to='contact-us'>
                                        Contact Us
                                    </NavLink>
                                </div>
                                :
                                <span></span>
                            }
                            <NavLink to='/' onClick={this.logout} className='signOut'>
                                <FontAwesomeIcon icon='sign-out-alt' />Sign out
                            </NavLink>
                        </div>

                        <Menu className='nav-mobile' right>
                            <a id="dashboard" className="menu-item" href="/">Dashboard</a>
                            <a id="sales" className="menu-item" href="/sales">Sales</a>

                            <a id="customers" className="menu-item" href="/customers">Customers</a>

                            <a id="dashboard" className="menu-item" href={`/profile/edit/${this.props.decoded.id}`}>Public Profile</a>

                            <a id="dashboard" className="menu-item" href={`/account/${this.props.decoded.id}`}>My Account</a>


                            <NavLink to='/' onClick={this.logout}>
                                <FontAwesomeIcon icon='sign-out-alt' />Sign out
                        </NavLink>
                        </Menu>
                    </div>
                    :
                    <div>
                        {this.props.login ?
                            <div className='link' onClick={() => this.props.setState({ login: false })} style={{padding: '0 30px'}}>Register</div>
                            :
                            <div className='link' onClick={() => this.props.setState({ login: true })} style={{padding: '0 30px'}}>Sign In</div>
                        }

                    </div>
                }
            </header>
        )
    }
}