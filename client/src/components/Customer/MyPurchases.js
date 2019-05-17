import React, { Component } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import Moment from 'react-moment';
import { NavLink } from 'react-router-dom'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


export default class MyPurchases extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pages: []
        }
    }

    componentDidMount() {
        const loginToken = window.localStorage.getItem("token");
        let decoded = ''
        if (loginToken) decoded = jwt_decode(loginToken);

        axios.get(`/api/customers/search?id=${decoded.id}`)
            .then((resp) => {
                console.log(resp)
                this.setState({
                    pages: resp.data.response[0].pages,
                    s3Bucket: resp.data.bucket
                })
            })
            .catch((error) => {
                console.error(error)
            })
    }

    render() {
        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>

                <div className='main'>
                    <h2 style={{textAlign: 'center'}}>My Purchases</h2>

                    {/* List pages in table format */}
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {this.state.pages.map((page, i) =>
                            <NavLink to={`/pages/${page.id}`} style={{ color: 'initial' }}>

                                <div key={i} className='page' style={{ display: 'flex' }}>
                                    <img src={`https://s3-us-west-1.amazonaws.com/${this.state.s3Bucket}/${page.imageLink}`} style={{ width: 75, objectFit: 'cover', marginRight: 20 }} />
                                    <div style={{ width: '100%' }}>
                                        <p>{page.name}</p>
                                        <p style={{ fontSize: 14, color: '#a4A5A8' }}>Published: <Moment format='M.DD.YYYY' date={page.createdAt} /></p>
                                        <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>${Math.floor(Math.random() * 9999).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                            <span>5.5k Followers</span>
                                            <span>+98%</span>
                                        </p>
                                    </div>
                                </div>
                            </NavLink>
                        )}
                    </div>
                </div>
            </ReactCSSTransitionGroup>

        )
    }
}