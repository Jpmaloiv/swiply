import React, { Component } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import Moment from 'react-moment';
import { NavLink } from 'react-router-dom'
import Button from 'react-bootstrap/Button'

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

                <div style={{ borderBottom: '1px solid #ebecef' }}>
                    <div className='center' style={{ margin: '75px auto' }}>
                        <h1 style={{ fontSize: 48, margin: 0 }}>Your Purchases</h1>
                        <p style={{ fontSize: 16, color: '#88898c' }}>Here are your most recent purchases of content</p>
                    </div>
                </div>
                <div style={{ background: 'linear-gradient(180deg, #EDF0F4 0%, #FFFFFF 65.24%, #FFFFFF 100%)' }}>
                    <div className='main my-purchases' style={{ margin: '0 auto', padding: 25 }}>

                        {/* List pages in table format */}
                        {this.state.pages.map((page, i) =>
                            <NavLink to={`/pages/${page.id}`} style={{ color: 'initial' }}>

                                <div className='page' style={{ display: 'flex', width: 'initial', height: 105, maxWidth: 1036, padding: 10, margin: '20px auto', alignItems: 'center', background: '#fff' }}>
                                    <div style={{ display: 'flex' }}>
                                        <img src={`https://s3-us-west-1.amazonaws.com/${this.state.s3Bucket}/${page.imageLink}`} style={{ height: 90, minWidth: 90, maxWidth: 90, objectFit: 'cover', borderRadius: 3 }} />
                                        <div style={{ width: "50%", textAlign: "left", display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 20 }}>
                                            <p style={{ whiteSpace: 'nowrap', fontSize: 20, color: '#1b1c1c' }}>{page.name}</p>
                                            <p style={{ fontSize: 14, color: '#a4A5A8' }}>Published: <Moment format='M.DD.YYYY' date={page.createdAt} /></p>
                                            <p className='previewText i' style={{ fontSize: 15, color: '#66686b' }}>{page.summary}</p>
                                        </div>
                                    </div>
                                    <div style={{ marginRight: 15 }}>
                                        <Button
                                            className='my-purchases'
                                            variant='outline'
                                            style={{ minWidth: 110, maxWidth: 110, height: 40, marginRight: '25px !important', border: '1px solid #5dcbb0', color: '#5dcbb0' }}
                                            onClick={(e) => e.preventDefault()}
                                        >Paid
                                    </Button>
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