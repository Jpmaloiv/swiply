import React, { Component } from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import Moment from 'react-moment';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { SocialIcon } from 'react-social-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            image: '',
            name: 'Page Name',
            description: 'Short Description',
            summary: 'Page Summary',
            user: { firstName: '', lastName: '', Pages: [] }
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
                })
            })
            .catch((error) => {
                console.error(error)
            })
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


    render() {

        const { user } = this.state

        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
                <div>
                    <div className='imageBanner set'>
                        <img src={`https://s3-us-west-1.amazonaws.com/${this.state.S3_BUCKET}/${user.imageLink}`} style={{ width: '100%', filter: 'blur(10px)', opacity: .3 }} alt='' />

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
                            <br />
                            <div>
                                <h3>{user.firstName + ' ' + user.lastName}</h3>
                                <p>{user.title}</p>
                            </div>
                            <div className='social'>
                                {/* {user.instagram ? <SocialIcon url={user.instagram} /> : <span></span>} */}
                                {user.facebook ? <SocialIcon url={user.facebook} /> : <span></span>}
                                {user.twitter ? <SocialIcon url={user.twitter} /> : <span></span>}
                                {user.linkedIn ? <SocialIcon url={user.linkedIn} /> : <span></span>}
                                {user.whatsapp ? <SocialIcon url={user.whatsapp} /> : <span></span>}
                                {user.website ? <SocialIcon url={user.website} /> : <span></span>}
                            </div>
                        </div>

                    </div>
                </div>

                <div className='main'>
                    <div>
                        <div style={{ display: 'flex' }}>
                            <p>{user.summary}</p>
                        </div>

                        {/* List pages in table format */}
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {this.state.user.Pages.map((page, i) =>
                                <NavLink to={`/pages/${page.id}`} style={{ color: 'initial' }}>

                                    <div key={i} className='page' style={{ display: 'flex' }}>
                                        <img src={`https://s3-us-west-1.amazonaws.com/${this.state.S3_BUCKET}/${page.imageLink}`} style={{ width: 75, objectFit: 'cover', marginRight: 20 }} />
                                        <div style={{ width: '100%' }}>
                                            <p>{page.name}</p>
                                            <p style={{ fontSize: 14, color: '#a4A5A8' }}>Published: <Moment format='M.DD.YYYY' date={page.createdAt} /></p>
                                            <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>$38,250</span>
                                                <span>5.5k Followers</span>
                                                <span>+98%</span>
                                            </p>
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

