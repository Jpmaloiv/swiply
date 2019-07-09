import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { NotificationContainer, NotificationManager } from "react-notifications";
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Moment from 'react-moment';
import { NavLink } from 'react-router-dom';
import { CopyToClipboard } from "react-copy-to-clipboard";



export default class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sort: 'views',
            sortTitle: 'Popular Pages',
            stats: [],
            pages: []
        }
    }

    componentWillMount() {
        console.log(this.state)
        const loginToken = window.localStorage.getItem("token");
        let decoded = ''
        if (loginToken) decoded = jwt_decode(loginToken);

        axios.get(`api/pages/search?userId=${decoded.id}&sort=${this.state.sort}`)
            .then((resp) => {
                console.log(resp)
                this.setState({
                    decoded: decoded,
                    pages: resp.data.response,
                    revenue: resp.data.revenue.fulfillmentValue,
                    S3_BUCKET: resp.data.bucket,
                    views: resp.data.views.fulfillmentValue
                })
            })
            .catch((error) => {
                console.error(error)
            })
    };

    componentDidUpdate(prevState) {
        if (prevState.copiedPage !== this.state.copiedPage) {
            this.copied.click()
        }
    }

    sortPages() {
        axios.get(`api/pages/search?userId=${this.state.decoded.id}&sort=${this.state.sort}`)
            .then((resp) => {
                this.setState({
                    pages: resp.data.response,
                    S3_BUCKET: resp.data.bucket
                })
            })
            .catch((error) => {
                console.error(error)
            })
    }

    createNotification(type) {
        const image =
            <div style={{ display: 'flex', alignItems: 'center' }}><img className='profilePic' src={`https://s3-us-west-1.amazonaws.com/${this.state.S3_BUCKET}/${this.state.copiedImage}`} style={{ width: 50, height: 50, objectFit: 'cover', marginLeft: 0, marginRight: 5 }} />
                <span>{this.state.copiedPage}</span>
            </div>

        return () => {
            switch (type) {
                case "copied":
                    NotificationManager.info(image, "Link copied to clipboard", 2500);
                    console.log(this.state)
                    break;
            };
        };
    }

    // Publishes or unpublishes the selected page
    handlePublish(page) {
        axios.put(`/api/pages/update?id=${page.id}&published=${!page.published}`)
            .then(res => {
                console.log(res)
                window.location.reload();
            }).catch(err => {
                console.error(err);
            })
    }

    // Deletes the selected page
    deletePage(page) {
        if (window.confirm(`Delete page ${page.name}?`)) {
            axios.delete(`/api/pages/delete?id=${page.id}`)
                .then(res => {
                    console.log(res)
                    window.location.reload();
                }).catch(err => {
                    console.error(err);
                })
        }
    }


    render() {

        const { sort } = this.state

        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
                <div className='main'>
                    <div className='statistics'>
                        <div style={{ backgroundColor: '#5dcbb0' }}>
                            <FontAwesomeIcon icon='dollar-sign' />
                            <div>{this.state.revenue}</div>
                            <div>Recent Earnings (+50)</div>
                        </div>
                        <div style={{ backgroundColor: '#595fdb' }}>
                            <FontAwesomeIcon icon='eye' />
                            <div>{this.state.views}</div>
                            <div>Recent View (+32)</div>
                        </div>
                        <div style={{ backgroundColor: '#4193f2' }}>
                            <FontAwesomeIcon icon='user-plus' />
                            <div>{Math.floor(Math.random() * 19999).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                            <div>New Followers (+90)</div>
                        </div>
                        <div style={{ backgroundColor: '#152343' }}>
                            <FontAwesomeIcon icon='signal' />
                            <div>{Math.floor(Math.random() * (9999)) / 100}%</div>
                            <div>Percentages (+20)</div>
                        </div>
                    </div>
                </div>

                <div style={{ backgroundColor: '#f9fafc', height: '100%', borderTop: '1px solid #ebecef' }}>
                    <div className='main'>
                        <div className='page-controls'>
                            <div>
                                <DropdownButton className='plain' title={this.state.sortTitle} variant='secondary'>
                                    <Dropdown.Item onClick={() => this.setState({ sort: 'views', sortTitle: 'Popular Pages' }, this.sortPages)} active={sort === 'views'}>Popular Pages</Dropdown.Item>
                                    <Dropdown.Item onClick={() => this.setState({ sort: 'date', sortTitle: 'Most Recently Created' }, this.sortPages)} active={sort === 'date'}>Most Recently Created</Dropdown.Item>
                                    <Dropdown.Item onClick={() => this.setState({ sort: 'revenue', sortTitle: 'Most Successful' }, this.sortPages)} active={sort === 'revenue'}>Most Successful</Dropdown.Item>
                                    <Dropdown.Item onClick={() => this.setState({ sort: 'convRatio', sortTitle: 'Highest Conversion Ratio' }, this.sortPages)} active={sort === 'convRatio'}>Highest Conversion Ratio</Dropdown.Item>
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
                                        <NavLink to={`/pages/${page.id}`} className='page' style={{ color: 'initial' }} key={i}>

                                            <div className='page'>
                                                <div style={{ display: 'flex', padding: 7.5 }}>
                                                    <img
                                                        src={page.imageLink
                                                            ? `https://s3-us-west-1.amazonaws.com/${this.state.S3_BUCKET}/${page.imageLink}`
                                                            : require('../images/page-bg.png')}
                                                        style={{ height: 90, minWidth: 90, maxWidth: 90, objectFit: 'cover', borderRadius: 3 }} />
                                                    <div style={{ width: '100%', marginLeft: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                                        <div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <p style={{ fontSize: 18 }}>{page.name}</p>

                                                                <DropdownButton
                                                                    className='ellipsis'
                                                                    onClick={e => e.preventDefault()}
                                                                    drop='left'
                                                                    variant="secondary"
                                                                    title={<FontAwesomeIcon icon='ellipsis-v' color='#66686b' />}
                                                                    id={`dropdown-button-drop-left`}
                                                                    key='left'>
                                                                    <Dropdown.Item onClick={() => window.location = `/pages/${page.id}`}>Edit/Preview</Dropdown.Item>
                                                                    <CopyToClipboard
                                                                        text={`${window.location.href}pages/${page.id}`}
                                                                        onCopy={() => this.setState({ copiedPage: page.name, copiedImage: page.imageLink })}
                                                                        style={{ cursor: "pointer" }}
                                                                    >
                                                                        <Dropdown.Item>Share</Dropdown.Item>
                                                                    </CopyToClipboard>
                                                                    <Dropdown.Item onClick={() => this.handlePublish(page)}>{page.published ? 'Unpublish' : 'Publish'}</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => this.deletePage(page)}>Delete</Dropdown.Item>
                                                                </DropdownButton>
                                                            </div>
                                                            <p style={{ fontSize: 14, color: '#a4A5A8' }}>Published: <Moment format='M.DD.YYYY' date={page.createdAt} /></p>
                                                        </div>
                                                        <p className='page-stats' style={{ width: '80%', display: 'flex', justifyContent: 'space-between' }}>
                                                            <span>${page.revenue}</span>
                                                            <span>{page.views} Views</span>
                                                            <span style={{ color: '#5dcbb0' }}>{page.views > 0 ? ((page.purchases / page.views) * 100).toFixed(0) : '-'}%</span>
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

                <button
                    className="btn btn-info"
                    onClick={this.createNotification("copied")}
                    ref={ref => (this.copied = ref)}
                    style={{ display: "none" }}
                >
                    Info
        </button>

                <NotificationContainer />
            </ReactCSSTransitionGroup >
        )
    }
}