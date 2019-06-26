import React, { Component } from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import Moment from 'react-moment';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            image: '',
            name: 'Page Name',
            description: 'Short Description',
            summary: 'Page Summary',
            user: { firstName: '', lastName: '', Pages: [] },
            pages: []
        }
    }

    componentWillMount() {

        axios.get('/api/users/search?profile=' + this.props.match.params.profile)
            .then((resp) => {
                console.log(resp)
                this.setState({
                    user: resp.data.response[0],
                    background: `https://s3-us-west-1.amazonaws.com/${resp.data.bucket}/${resp.data.response[0].Pages[0].imageLink}` || '',
                    S3_BUCKET: resp.data.bucket
                }, this.filterPublishedPages)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    filterPublishedPages() {
        let { Pages } = this.state.user
        let pages = Pages.filter(el => { return el.published == true })
        this.setState({ pages: pages })
    }


    // Handles user input
    handleChange = e => {
        this.state.page[e.target.name] = e.target.value
    };

    // Controls editing state
    handleEditing = e => {
        let name = e.currentTarget.getAttribute('name') + 'Edit'
        this.setState({ [name]: !this.state[name] });
    }

    // Handles social media links
    handleLinks = e => {
        let name = e.target.alt
        if (name === 'instagram' || name === 'twitter') window.open(`http://www.${name}.com/${this.state.user[name].replace('@', '')}`)
        else window.open(this.state.user[name])
    }

    render() {

        const { user } = this.state

        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
                <div>
                    <div className='imageBanner set'>
                        <img src={`https://s3-us-west-1.amazonaws.com/${this.state.S3_BUCKET}/${user.imageLink}`} style={{ width: '100%', filter: 'blur(12px)', opacity: 0.25 }} alt='' />

                        <div className='textOverlay'>
                            <div className='profilePic'>
                                {user.imageLink ?
                                    <img src={`https://s3-us-west-1.amazonaws.com/${this.state.S3_BUCKET}/${user.imageLink}`} style={{ width: 75, height: 75, borderRadius: '50%', objectFit: 'cover' }} alt='' />
                                    :
                                    <FontAwesomeIcon
                                        icon='user-plus'
                                        size='2x'
                                        color='white'
                                        style={{ opacity: .8, cursor: 'initial' }}
                                    />
                                }
                            </div>

                            <div>
                                <p className='page-name'>{user.firstName + ' ' + user.lastName}</p>
                                <p className='page-description' style={{fontStyle: 'italic', whiteSpace: 'nowrap'}}>{user.title}</p>
                            </div>
                            <div className='social'>
                                {user.instagram ?
                                    <img src={require(`../../images/instagram.png`)} alt='instagram' onClick={this.handleLinks} />
                                    : <span></span>
                                }
                                {user.facebook ?
                                    <img src={require(`../../images/facebook.png`)} alt='facebook' onClick={this.handleLinks} />
                                    : <span></span>
                                }
                                {user.twitter ?
                                    <img src={require(`../../images/twitter.png`)} alt='twitter' onClick={this.handleLinks} />
                                    : <span></span>
                                }
                                {user.linkedIn ?
                                    <img src={require(`../../images/linkedIn.png`)} alt='linkedIn' onClick={this.handleLinks} />
                                    : <span></span>
                                }
                            </div>
                        </div>

                    </div>
                </div>

                <div className='main'>
                    <div>
                        <div style={{ display: 'flex' }}>
                            <p className='profile-summary'>{user.summary}</p>
                        </div>

                        {/* List pages in table format */}
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {this.state.pages.map((page, i) =>
                                <NavLink to={`/pages/${page.id}`} className='page' style={{ color: 'initial' }}>

                                    <div key={i} className='page'>
                                        <div style={{ display: 'flex', padding: 7.5 }}>

                                            <img src={`https://s3-us-west-1.amazonaws.com/${this.state.S3_BUCKET}/${page.imageLink}`} style={{ height: 90, minWidth: 90, maxWidth: 90, objectFit: 'cover', borderRadius: 3 }} />
                                            <div style={{ width: "100%", textAlign: "left", display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 20 }}>
                                                <div>
                                                    <p style={{ fontSize: 18, whiteSpace: 'nowrap' }}>{page.name}</p>
                                                    <p style={{ fontSize: 14, color: '#a4A5A8' }}>Published: <Moment format='M.DD.YYYY' date={page.createdAt} /></p>
                                                </div>
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

                </div>
            </ReactCSSTransitionGroup >
        )
    }
}

