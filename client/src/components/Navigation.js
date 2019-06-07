import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { slide as Menu } from 'react-burger-menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default class Navigation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            menuOpen: false
        }
    }

    logout() {
        if (window.confirm('Would you like to log out of PV3?')) {
            window.localStorage.removeItem('token')
            window.location = '/'
        } else {
            return;
        }
    }

    handleStateChange(state) {
        this.setState({ menuOpen: state.isOpen })
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
                        <h1 style={{ color: '#333', margin: '0 30px' }}>Swiply</h1>
                    </NavLink>
                </div>
                {this.props.decoded ?
                    <div style={{ height: '100%' }}>
                        <div className='navigation' style={{ height: '100%' }}>
                            {role === 'user' ?
                                <div style={{ display: 'inherit' }}>
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
                                <div style={{ display: 'inherit' }}>
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

                        <Menu isOpen={false} width={350} className='nav-mobile'>
                            {role === 'user' ?
                                <div>
                                    <NavLink to='/' exact={true} className='bm-item menu-item'>
                                        <div>
                                            <h5>Dashboard</h5>
                                            <p>View your pages and their statistics</p>
                                        </div>
                                        <FontAwesomeIcon icon='angle-right' size='2x' color='#02ae63' />
                                    </NavLink>
                                    <NavLink to='/sales' className='bm-item menu-item'>
                                        <div>
                                            <h5>Sales</h5>
                                            <p>Review the sales details of your pages</p>
                                        </div>
                                        <FontAwesomeIcon icon='angle-right' size='2x' color='#02ae63' />

                                    </NavLink>
                                    <NavLink to='/customers' className='bm-item menu-item' isOpen={this.state.menuOpen} onStateChange={(state) => this.handleStateChange(state)}>
                                        <div>
                                            <h5>Customers</h5>
                                            <p>Analyze your customer data</p>
                                        </div>
                                        <FontAwesomeIcon icon='angle-right' size='2x' color='#02ae63' />
                                    </NavLink>
                                    <NavLink to={`/profile/edit/${this.props.decoded.id}`} className='bm-item menu-item'>
                                        <div>
                                            <h5>Public Profile</h5>
                                            <p>View how customers see your profile</p>
                                        </div>
                                        <FontAwesomeIcon icon='angle-right' size='2x' color='#02ae63' />

                                    </NavLink>
                                </div>
                                :
                                <span></span>
                            }

                            <NavLink to='/' className="menu-item">
                                <div>
                                    <h5>My Account</h5>
                                    <p>View your profile and content</p>
                                </div>
                                <FontAwesomeIcon icon='angle-right' size='2x' color='#02ae63' />
                            </NavLink>

                            {role === 'customer' ?
                                <div>
                                    <NavLink to='/purchases' className="menu-item">
                                        <div>
                                            <h5>My Purchases</h5>
                                            <p>View all content purchases</p>
                                        </div>
                                        <FontAwesomeIcon icon='angle-right' size='2x' color='#02ae63' />
                                    </NavLink>
                                    <NavLink to='contact-us' className="menu-item">
                                        <div>
                                            <h5>Contact Us</h5>
                                            <p>Get help from our support team</p>
                                        </div>
                                        <FontAwesomeIcon icon='angle-right' size='2x' color='#02ae63' />
                                    </NavLink>
                                </div>
                                :
                                <span></span>
                            }
                            <NavLink className="menu-item" href="/contact">
                                <div>
                                    <h5>Sign Out</h5>
                                    <p>Last login: June 7, 2019 at 3:30pm</p>
                                </div>
                                <FontAwesomeIcon icon='angle-right' size='2x' color='#02ae63' />
                            </NavLink>
                        </Menu>

                    </div>
                    :
                    <div>
                        {this.props.login ?
                            <div className='link' onClick={() => this.props.setState({ login: false })} style={{ padding: '0 30px' }}>Register</div>
                            :
                            <div className='link' onClick={() => this.props.setState({ login: true })} style={{ padding: '0 30px' }}>Sign In</div>
                        }

                    </div>
                }
            </header>
        )
    }
}