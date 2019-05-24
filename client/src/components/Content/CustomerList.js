import axios from 'axios';
import jwt_decode from 'jwt-decode';
import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Moment from 'react-moment';
import { NavLink } from 'react-router-dom';



export default class CustomerList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            stats: [],
            pages: [],
            customers: []
        }
    }

    componentWillMount() {
        const loginToken = window.localStorage.getItem("token");
        let decoded = ''
        if (loginToken) decoded = jwt_decode(loginToken);

        axios.get('api/customers/search?userId=' + decoded.name)
            .then((resp) => {
                console.log(resp)
                this.setState({
                    customers: resp.data.response,
                    S3_BUCKET: resp.data.bucket
                })
            })
            .catch((error) => {
                console.error(error)
            })
    }



    render() {
        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
                <div style={{backgroundColor: '#f9fafc', borderTop: '1px solid #ebecef'}}>
                    <div className='main'>
                        <div style={{ display: 'flex', flex: 1, justifyContent: 'center', margin: '20px auto' }}>
                            <div>
                                <DropdownButton title="Recent Customers">
                                    <Dropdown.Item href="#/action-1">Recent Customers</Dropdown.Item>
                                    <Dropdown.Item href="#/action-2">Pages Purchased</Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">Highest Value</Dropdown.Item>
                                    <Dropdown.Item href="#/action-4">Sort Criteria</Dropdown.Item>
                                </DropdownButton>
                            </div>
                        </div>

                        {/* List pages in table format */}
                        <div style={{ display: 'flex', flex: 1, justifyContent: 'center'}}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {this.state.pages.map((page, i) =>
                                <NavLink to={`/pages/${page.id}`} style={{ color: 'initial' }}>

                                    <div key={i} className='page' style={{ display: 'flex' }}>
                                        <img src={`https://s3-us-west-1.amazonaws.com/${this.state.S3_BUCKET}/${page.imageLink}`} style={{ width: 75, objectFit: 'cover', marginRight: 20 }} />
                                        <div style={{width: '100%'}}>
                                            <p>{page.name}</p>
                                            <p style={{fontSize: 14, color: '#a4A5A8'}}>Item: <Moment format='M.DD.YYYY' date={page.createdAt} /></p>
                                            <p style={{ alignItems: 'left'}}>
                                            <span style={{fontSize: 14}}>Status: </span><span style={{fontSize: 14, color: 'green'}}>Paid</span>
                                            </p>
                                        </div>
                                    </div>
                                </NavLink>
                            )}
                        </div>
                        </div>

                    </div >
                </div>
            </ReactCSSTransitionGroup >
        )
    }
}