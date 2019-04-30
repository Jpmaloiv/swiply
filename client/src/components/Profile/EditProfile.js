import React, { Component } from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import Moment from 'react-moment';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default class EditProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            image: '',
            user: { firstName: '', lastName: '', Pages: [], profile: '', instagram: '', facebook: '', twitter: '', linkedin: '', whatsapp: '', website: '' },
            copied: false
        }
    }

    componentWillMount() {
        const loginToken = window.localStorage.getItem("token");
        let decoded = ''
        if (loginToken) decoded = jwt_decode(loginToken)

        axios.get('/api/users/search?id=' + decoded.id)
            .then((resp) => {
                console.log(resp)
                this.setState({
                    user: resp.data.response[0],
                    image: `https://s3-us-west-1.amazonaws.com/${resp.data.bucket}/${resp.data.response[0].imageLink}`,
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
        this.state.user[e.target.name] = e.target.value
    };

    updateUser() {
        const { user } = this.state;
        console.log(user)
        axios.put('/api/users/update?id=' + user.id + '&profile=' + user.profile + '&instagram=' + user.instagram + '&facebook=' + user.facebook + '&twitter=' + user.twitter + '&linkedin=' + user.linkedin +
            '&whatsapp=' + user.whatsapp + '&website=' + user.website)
            .then(res => {
                console.log(res)
                window.location.reload();
            }).catch(err => {
                console.error(err);
            })
    }


    render() {

        const { user } = this.state

        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
                <div style={{ display: 'flex' }}>
                    <div style={{ flex: 1 }}>
                        <div className='center' style={{ textAlign: 'left' }}>
                            <h5 style={{ textAlign: 'center' }}>My PV3 Link</h5>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>https://pv3-dev.herokuapp.com/</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    placeholder={user.profile || user.id}
                                    style={{ borderRadius: 0 }}
                                    name='profile'
                                    onChange={this.handleChange}
                                />
                                <CopyToClipboard text={`https://pv3-dev.herokuapp.com/${user.profile || user.id}`} onCopy={() => this.setState({ copied: true })} style={{ cursor: 'pointer' }}>
                                    <InputGroup.Append>
                                        <InputGroup.Text style={{ background: '#01ae63', color: '#fff', borderRadius: 30, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>Copy</InputGroup.Text>
                                    </InputGroup.Append>
                                </CopyToClipboard>
                            </InputGroup>
                            <br />
                            <h3>Connect Your Social Media</h3>
                            <p>Add links to your social media accounts below:</p>
                            <label>Instagram</label>
                            <InputGroup>
                                <FormControl
                                    placeholder={user.instagram}
                                    name='instagram'
                                    onChange={this.handleChange}
                                />
                            </InputGroup>
                            <label>Facebook</label>
                            <InputGroup>
                                <FormControl
                                    placeholder={user.facebook}
                                    name='facebook'
                                    onChange={this.handleChange}
                                />
                            </InputGroup>
                            <label>Twitter</label>
                            <InputGroup>
                                <FormControl
                                    placeholder={user.twitter}
                                    name='twitter'
                                    onChange={this.handleChange}
                                />
                            </InputGroup>
                            <label>Linkedin</label>
                            <InputGroup>
                                <FormControl
                                    placeholder={user.linkedin}
                                    name='linkedin'
                                    onChange={this.handleChange}
                                />
                            </InputGroup>
                            <label>WhatsApp</label>
                            <InputGroup>
                                <FormControl
                                    placeholder={user.whatsapp}
                                    name='whatsapp'
                                    onChange={this.handleChange}
                                />
                            </InputGroup>
                            <label>Website (URL)</label>
                            <InputGroup>
                                <FormControl
                                    placeholder={user.website}
                                    name='website'
                                    onChange={this.handleChange}
                                />
                            </InputGroup>
                            <label>Email Address</label>
                            <InputGroup>
                                <FormControl
                                    placeholder={user.email}
                                    name='email'
                                    onChange={this.handleChange}
                                />
                            </InputGroup>
                        </div>

                        <Button
                            variant='success'
                            size='lg'
                            style={{ display: 'block' }}
                            onClick={this.updateUser.bind(this)}
                        >
                            Update Info
                    </Button>
                    </div>


                    <div className='editProfile' style={{ flex: 1.5 }}>
                        <div className='center'>
                            <div className="smartphone" style={{ overflow: 'scroll', boxShadow: '-5px 10px 35px 1px #333' }}>
                                <div className="content">
                                    {/* <iframe src="/w3css/tryw3css_templates_band.htm" style={{width: '100%', border: 'none', height: '100%'}} /> */}

                                    <div className='imageBanner set' style={{ height: 'initial' }}>
                                        <img src={this.state.background} style={{ width: '100%', opacity: .3 }} alt='' />

                                        <div className='textOverlay'>
                                            <div className='profilePic'>
                                                {this.state.image ?
                                                    <img src={this.state.image} style={{ width: 75, height: 75, borderRadius: '50%', objectFit: 'cover' }} alt='' />
                                                    :
                                                    <FontAwesomeIcon
                                                        icon='plus'
                                                        size='2x'
                                                        style={{ opacity: .2 }}
                                                        onClick={() => { this.upload.click() }}
                                                    />
                                                }
                                            </div>
                                            <br />
                                            <div>
                                                <h3>{user.firstName + ' ' + user.lastName}</h3>
                                                <p>{user.title}</p>
                                            </div>
                                        </div>

                                    </div>

                                    {/* List pages in table format */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', margin: '15px 10px' }}>
                                        <h6 style={{ textAlign: 'left' }}>Courses</h6>

                                        {this.state.user.Pages.map((page, i) =>
                                            <NavLink to={`/pages/${page.id}`} style={{ color: 'initial', width: '100%' }} key={i}>
                                                <div className='page' style={{ display: 'flex', width: 'initial', margin: '5px 0' }}>
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
                        </div>

                    </div>

                </div >
            </ReactCSSTransitionGroup >
        )
    }
}