import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Moment from 'react-moment';
import { NavLink } from 'react-router-dom';



export default class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            stats: [],
            pages: []
        }
    }

    componentWillMount() {
        const loginToken = window.localStorage.getItem("token");
        let decoded = ''
        if (loginToken) decoded = jwt_decode(loginToken);

        axios.get('api/pages/search?userId=' + decoded.id)
            .then((resp) => {
                console.log(resp, "Hello Response!")
                console.log(resp.data.response[1].User.createdAt, "Date content created")
                this.setState({
                    pages: resp.data.response,
                    S3_BUCKET: resp.data.bucket
                })
            })
            .catch((error) => {
                console.error(error)
            })
    };

    sortDates = () => {
        function date(a, b) {
            var dateA = new Date(a.date).getTime();
            var dateB = new Date(b.date).getTime();
            return dateA > dateB ? 1 : -1;
        };
        this.state.pages.sort(date)
        this.setState({
            pages: this.state.pages
        })
    }

    sortCount = () => {
        function count(a, b) {
            return b.views - a.views;
        };
        this.state.pages.sort(count)
        this.setState({
            pages: this.state.pages
        })
    }

    //     sortRating = () => {
    //         function rating(a, b) {
    //     return b.rating - a.rating;
    // };
    //         this.state.pages.sort(rating)
    //         this.setState({
    //             pages: this.state.pages
    //         })
    //     }


    render() {
        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
                <div className='main'>
                    <div className='statistics'>
                        <div style={{ backgroundColor: '#01ae63' }}>
                            <FontAwesomeIcon icon='dollar-sign' />
                            <div>${Math.floor(Math.random() * 99)}k</div>
                            <div>Recent Earnings (+50)</div>
                        </div>
                        <div style={{ backgroundColor: '#e0ab01' }}>
                            <FontAwesomeIcon icon='eye' />
                            <div>{Math.floor(Math.random() * (250)) / 10}m</div>
                            <div>Recent View (+32)</div>
                        </div>
                        <div style={{ backgroundColor: '#0650df' }}>
                            <FontAwesomeIcon icon='user-plus' />
                            <div>{Math.floor(Math.random() * 19999).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                            <div>New Followers (+90)</div>
                        </div>
                        <div style={{ backgroundColor: '#3808aa' }}>
                            <FontAwesomeIcon icon='signal' />
                            <div>{Math.floor(Math.random() * (9999)) / 100}%</div>
                            <div>Percentages (+20)</div>
                        </div>
                    </div>
                </div>

                <div style={{ backgroundColor: '#f9fafc', borderTop: '1px solid #ebecef' }}>
                    <div className='main'>
                        <div className='page-controls'>
                            <div>
                                <DropdownButton className='plain' title="Popular Pages" variant='secondary'>
                                    <Dropdown.Item onClick={this.sortDates} href="#/action-1">Date Published</Dropdown.Item>
                                    <Dropdown.Item onClick={this.sortCount} href="#/action-2">Highest Rated</Dropdown.Item>
                                    <Dropdown.Item
                                        // onClick={this.sortRating}
                                        href="#/action-3">Most Content</Dropdown.Item>
                                </DropdownButton>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <h5 style={{ margin: 0 }}>Add Page</h5>
                                <NavLink to='/pages/add'>
                                    <Button
                                        variant='success'
                                        size='lg'
                                        className='circle'
                                    >
                                        <FontAwesomeIcon icon='plus' />
                                    </Button>
                                </NavLink>
                            </div>
                        </div>

                        {/* List pages in table format */}
                        <div>
                            <div>
                                <div className='test' style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', maxWidth: 1300, margin: '0 auto' }}>
                                    {this.state.pages.map((page, i) =>
                                        <NavLink to={`/pages/${page.id}`} className='page' style={{ color: 'initial' }}>

                                            <div key={i} className='page'>
                                                <div style={{ display: 'flex', padding: 7.5 }}>
                                                    <img src={`https://s3-us-west-1.amazonaws.com/${this.state.S3_BUCKET}/${page.imageLink}`} style={{ height: 90, minWidth: 90, maxWidth: 90, objectFit: 'cover', borderRadius: 3 }} />
                                                    <div style={{ width: '100%', marginLeft: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                                        <div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <p style={{ fontSize: 18 }}>{page.name}</p>
                                                                <FontAwesomeIcon icon='ellipsis-v' color='#66686b' />
                                                            </div>
                                                            <p style={{ fontSize: 14, color: '#a4A5A8' }}>Published: <Moment format='M.DD.YYYY' date={page.createdAt} /></p>
                                                        </div>
                                                        <p className='page-stats'>
                                                            <span>${Math.floor(Math.random() * 9999).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                                &nbsp;&nbsp;&nbsp;&nbsp;5.5k Followers
                                                            &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#01ae63' }}>+98%</span></span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </NavLink>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div >
                </div>
            </ReactCSSTransitionGroup >
        )
    }
}