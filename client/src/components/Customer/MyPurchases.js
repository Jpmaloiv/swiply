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
                    <h2 style={{ textAlign: 'center' }}>My Purchases</h2>

                    {/* List pages in table format */}
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {this.state.pages.map((page, i) =>
                            <NavLink to={`/pages/${page.id}`} style={{ color: 'initial' }}>

                                <div key={i} className='page'>
                                    <div style={{ display: 'flex', padding: 7.5 }}>
                                        <img src={`https://s3-us-west-1.amazonaws.com/${this.state.s3Bucket}/${page.imageLink}`} style={{ height: 90, minWidth: 90, maxWidth: 90, objectFit: 'cover', borderRadius: 3 }} />
                                        <div style={{ width: "100%", textAlign: "left", display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', marginLeft: 20 }}>
                                            <p style={{ whiteSpace: 'nowrap' }}>{page.name}</p>
                                            <p className='previewText'>
                                                {page.summary}
                                            </p>
                                        </div>
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