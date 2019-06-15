import React, { Component } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { NavLink } from 'react-router-dom'
import Moment from 'react-moment';
import Switch from "react-switch";

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import Spinner from 'react-bootstrap/Spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default class PageView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            image: '',
            name: 'Page Name',
            description: 'Short Description',
            summary: 'Page Summary',
            page: { User: {}, Contents: [] },
            edit: false,
            priceEdit: false,
            viewAccess: false,
            submit: false
        }
        this.handleSwitch = this.handleSwitch.bind(this)
    }

    componentWillMount() {
        window.localStorage.removeItem('customer')
        window.localStorage.removeItem('pageId')
        window.localStorage.removeItem('page')

        const loginToken = window.localStorage.getItem("token");
        if (loginToken) this.setState({ decoded: jwt_decode(loginToken) })

        axios.get('/api/pages/search?pageId=' + this.props.match.params.pageId)
            .then((resp) => {
                console.log(resp)

                if (resp.data.response[0].imageLink) {
                    this.setState({
                        image: `https://s3-us-west-1.amazonaws.com/${resp.data.bucket}/${resp.data.response[0].imageLink}`,
                    })
                }
                this.setState({
                    page: resp.data.response[0],
                    s3Bucket: resp.data.bucket
                }, this.checkPermissions)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    componentDidMount() {
        axios.put(`/api/pages/update?id=${this.props.match.params.pageId}&view=${true}`)
            .then((resp) => {
                console.log(resp)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    checkPermissions() {
        console.log(this.state.decoded)
        if (this.state.decoded) {
            if (this.state.decoded.role === 'customer') {
                axios.get(`/api/customers/search?id=${this.state.decoded.id}`)
                    .then((resp) => {
                        console.log(resp)
                        let customer = resp.data.response[0]
                        let pageIds = [];
                        for (var i = 0; i < customer.pages.length; i++) {
                            pageIds.push(customer.pages[i].id)
                        }

                        if (pageIds.includes(this.state.page.id)) this.setState({ viewAccess: true })
                    })
                    .catch((error) => {
                        console.error(error)
                    })
            }
        }

        if (this.state.decoded) {
            if (this.state.decoded.id === this.state.page.UserId) this.setState({ edit: true })
        }
    }

    // Handles user input
    handleChange = e => {
        const { page } = this.state
        if (e.target.name.includes('User')) {
            let name = e.target.name.replace('User', '')
            if (name === 'name') {
                let arr = e.target.value.split(' ')
                page.User.firstName = arr[0]
                page.User.lastName = arr[1]
            } else {
                page.User[name] = e.target.value
            }
        }
        else {
            page[e.target.name] = e.target.value
        }
    };

    // Preview image once seleted
    onImageChange = e => {
        const file = e.target.files[0]
        this.setState({
            image: URL.createObjectURL(file),
            file: file,
            fileName: file.name,
            fileType: file.type
        })
    }

    // Controls editing state
    handleEditing = e => {
        let name = e.currentTarget.getAttribute('name') + 'Edit'
        this.setState({ [name]: !this.state[name] });
    }

    handleSwitch(checked) {
        this.state.page.displayProfile = checked
        this.setState({ render: !this.state.render });
    }

    // Toggles whether page is published
    handlePublish = e => {
        const published = e.target.value;
        const { page } = this.state;
        axios.put('/api/pages/update?id=' + page.id + '&published=' + published)
            .then(res => {
                console.log(res)
                window.location.reload();
            }).catch(err => {
                console.error(err);
            })
    }

    // Updates page and user with any changes made
    async updatePage() {
        this.setState({ submit: true })
        const { file, page } = this.state;
        const user = page.User

        let data = new FormData();
        data.append("imgFile", file)

        await axios.put('/api/pages/update?id=' + page.id + '&name=' + page.name + '&description=' + page.description +
            '&summary=' + page.summary + '&price=' + page.price + '&displayProfile=' + page.displayProfile, data)
            .then(res => {
                console.log(res)
                window.location.reload();
            }).catch(err => {
                console.error(err);
            })

        await axios.put(`/api/users/update?id=${user.id}&firstName=${user.firstName}&lastName=${user.lastName}&title=${user.title}&summary=${user.summary}`)
            .then(res => {
                console.log(res)
                window.location.reload();
            }).catch(err => {
                console.error(err);
            })

        window.location.reload()
    }


    customerSignup() {
        window.localStorage.setItem('customer', true);
        window.localStorage.setItem('pageId', this.state.page.id);
        window.localStorage.setItem('page', this.state.page.name)
        window.location = `/`
    }


    render() {

        const { edit, page } = this.state
        const user = page.User

        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
                <div>
                    <div className={this.state.image === '' ? 'imageBanner' : 'imageBanner set'}>
                        <input type='file' ref={(ref) => this.upload = ref} onChange={this.onImageChange} style={{ display: 'none' }} />
                        <img src={this.state.image} className='page-image' alt='' />

                        {edit ?
                            <div>
                                <div style={{ position: 'absolute', top: 10, right: 25 }}>
                                    {page.published ?
                                        <Button
                                            variant='dark'
                                            size='sm'
                                            value={false}
                                            onClick={this.handlePublish.bind(this)}
                                            style={{ width: 'initial' }}
                                        >
                                            Unpublish
                                    </Button>
                                        :
                                        <Button
                                            variant='dark'
                                            size='sm'
                                            value={true}
                                            onClick={this.handlePublish.bind(this)}
                                            style={{ width: 'initial' }}
                                        >
                                            Publish
                                    </Button>
                                    }
                                </div>
                                <div className='image-change_icon'>
                                    <Button
                                        variant='dark'
                                        className='circle'
                                        style={{ width: 40, height: 40, border: '1.5px solid #fff' }}
                                        onClick={() => this.upload.click()}
                                    >
                                        <FontAwesomeIcon
                                            icon='camera'
                                        />
                                    </Button>
                                </div>
                            </div>
                            :
                            <span></span>
                        }

                        <div className='textOverlay'>
                            {this.state.nameEdit ?
                                <InputGroup>
                                    <FormControl
                                        style={{ width: 'initial' }}
                                        placeholder={this.state.name}
                                        name='name'
                                        onChange={this.handleChange}
                                        onBlur={this.handleEditing}
                                        autoFocus
                                    />
                                </InputGroup>
                                :
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <p className='page-name'>{page.name}</p>
                                    {edit ?
                                        <FontAwesomeIcon icon='pen' name='name' onClick={this.handleEditing} />
                                        :
                                        <span></span>
                                    }
                                </div>
                            }
                            {this.state.descriptionEdit ?
                                <FormControl
                                    style={{ width: 'initial' }}
                                    placeholder={this.state.description}
                                    name='description'
                                    onChange={this.handleChange}
                                    onBlur={this.handleEditing}
                                    autoFocus
                                />
                                :
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <p className='page-description'>{page.description}</p>
                                    {edit ?
                                        <FontAwesomeIcon icon='pen' name='description' onClick={this.handleEditing} />
                                        :
                                        <span></span>
                                    }
                                </div>
                            }

                            {this.state.viewAccess ? <span></span>
                                :
                                <Button
                                    variant='success'
                                    size='lg'
                                    onClick={edit ? null : this.state.decoded
                                        ? () => window.location = '/checkout'
                                        : () => this.customerSignup()}
                                >

                                    {edit ?
                                        <div>
                                            {this.state.priceEdit ?
                                                <FormControl
                                                    style={{ width: 'initial' }}
                                                    placeholder="Amount or 'Free'"
                                                    name='price'
                                                    onChange={this.handleChange}
                                                    onBlur={this.handleEditing}
                                                    autoFocus
                                                />
                                                :
                                                <div>
                                                    Set Pricing ${page.price ? page.price : '--'}&nbsp;
                                                {edit ?
                                                        <FontAwesomeIcon icon='pen' name='price' onClick={this.handleEditing} />
                                                        :
                                                        <span></span>
                                                    }
                                                </div>
                                            }
                                        </div>
                                        :
                                        <span>Request Page Access ${page.price}</span>
                                    }
                                </Button>
                            }
                        </div>
                    </div>
                </div>


                <div style={{ width: '100%', borderBottom: '1px solid #ebecef' }}>
                    <div className='main' style={{ marginBottom: 0 }}>
                        <div className='profile'>
                            {page.displayProfile ?
                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                    <div className='profile-header'>
                                        <img src={`https://s3-us-west-1.amazonaws.com/${this.state.s3Bucket}/${user.imageLink}`} style={{ width: 75, height: 75, marginRight: 30, borderRadius: '50%', objectFit: 'cover' }} alt='' />
                                        <div className='profile-name'>
                                            {this.state.nameUserEdit ?
                                                <InputGroup>
                                                    <FormControl
                                                        placeholder={user.firstName + ' ' + user.lastName}
                                                        name='nameUser'
                                                        onChange={this.handleChange}
                                                        onBlur={this.handleEditing}
                                                        autoFocus
                                                    />
                                                </InputGroup>
                                                :
                                                <div style={{ display: 'flex' }}>
                                                    <h5 style={{ margin: 0 }}>{user.firstName} {user.lastName}
                                                        {edit ?
                                                            <FontAwesomeIcon icon='pen' size='xs' name='nameUser' onClick={this.handleEditing} style={{ position: 'absolute', opacity: 0.3 }} />
                                                            :
                                                            <span></span>
                                                        }</h5>
                                                </div>
                                            }
                                            {this.state.titleUserEdit ?
                                                <InputGroup>
                                                    <FormControl
                                                        placeholder={user.title}
                                                        name='titleUser'
                                                        onChange={this.handleChange}
                                                        onBlur={this.handleEditing}
                                                        autoFocus
                                                    />
                                                </InputGroup>
                                                :
                                                <div style={{ display: 'flex' }}>
                                                    <p className='title'><i>{user.title}</i>
                                                        {edit
                                                            ? <FontAwesomeIcon icon='pen' size='xs' name='titleUser' onClick={this.handleEditing} style={{ position: 'absolute', opacity: 0.3 }} />
                                                            : <span></span>
                                                        }</p>
                                                </div>
                                            }
                                        </div>

                                        <div>
                                            {edit ?
                                                <NavLink to={`/account/${this.state.decoded.id}`}>
                                                    <Button
                                                        size='sm'
                                                        style={{ width: 76, border: '1px solid #DFE1E6', borderRadius: 2, backgroundColor: 'transparent', color: '#181818' }}
                                                    >
                                                        EDIT
                                                </Button>
                                                </NavLink>
                                                :
                                                <span></span>
                                            }
                                        </div>

                                    </div>
                                    {this.state.summaryUserEdit ?
                                        <InputGroup>
                                            <FormControl
                                                as='textarea'
                                                style={{ width: '80%' }}
                                                placeholder={user.summary}
                                                name='summaryUser'
                                                onChange={this.handleChange}
                                                onBlur={this.handleEditing}
                                                autoFocus
                                            />
                                        </InputGroup>
                                        :
                                        <div style={{ display: 'flex' }}>
                                            <p className='profile-summary'>
                                                {user.summary}
                                                {edit
                                                    ? <FontAwesomeIcon icon='pen' name='summaryUser' onClick={this.handleEditing} style={{ opacity: 0.3 }} />
                                                    : <span></span>
                                                }
                                            </p>
                                        </div>
                                    }

                                </div>
                                :
                                <span></span>
                            }
                            {edit ?
                                <div>
                                    <div className='profile-switch'>
                                        <span style={{ marginRight: 10, fontSize: 14 }}>DISPLAY PROFILE</span>
                                        <Switch onChange={this.handleSwitch.bind(this)} checked={page.displayProfile} checkedIcon={false} uncheckedIcon={false} />
                                    </div>
                                </div>
                                :
                                <span></span>
                            }
                        </div>
                    </div>
                </div>

                <div style={{ width: '100%', background: '#f9fafc' }}>
                    <div className='main' style={{ marginTop: 0 }}>
                        <div className='page-summary'>
                            <div style={this.state.summaryEdit ? { paddingRight: 35, width: '80%' } : { paddingRight: 35 }}>
                                <div style={{ display: 'flex' }}>
                                    <p style={{ fontSize: 24 }}>Page Summary</p>
                                    {edit ?
                                        <FontAwesomeIcon icon='pen' name='summary' onClick={this.handleEditing} style={{ opacity: 0.3 }} />
                                        :
                                        <span></span>
                                    }
                                </div>
                                {this.state.summaryEdit ?
                                    <p>
                                        <InputGroup>
                                            <FormControl
                                                as='textarea'
                                                placeholder={this.state.summary}
                                                name='summary'
                                                onChange={this.handleChange}
                                                onBlur={this.handleEditing}
                                                autoFocus
                                            />
                                        </InputGroup>
                                    </p>
                                    :
                                    <p>{page.summary}</p>
                                }
                            </div>
                            <div>
                                {edit ?
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 35, whiteSpace: 'nowrap' }}>
                                        <h5 style={{ margin: 0 }}>Add Content</h5>
                                        <NavLink to={`/pages/${this.props.match.params.pageId}/add-content`}>
                                            <Button
                                                variant='success'
                                                size='lg'
                                                className='circle'
                                            >
                                                <FontAwesomeIcon icon='plus' />
                                            </Button>
                                        </NavLink>
                                    </div>
                                    :
                                    <span></span>
                                }
                            </div>
                        </div>

                        {/* List pages in table format */}
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {this.state.page.Contents.map((content, i) =>
                                <a
                                    href={this.state.viewAccess || this.state.edit
                                        ? content.type === 'video'
                                            ? `/pages/${this.props.match.params.pageId}/${content.id}`
                                            : `https://s3-us-west-1.amazonaws.com/${this.state.s3Bucket}/${content.link}`
                                        : <span></span>}
                                    style={{ color: 'initial' }}
                                >

                                    <div key={i} className='page'>
                                        <div style={{ display: 'flex', padding: 7.5 }}>
                                            {content.type === 'video'
                                                ? <img src={`https://img.youtube.com/vi/${content.link}/0.jpg`} style={{ height: 90, minWidth: 90, maxWidth: 90, objectFit: 'cover', borderRadius: 3 }} />
                                                : <img src={require(`../../images/file.png`)} style={{ height: 90, minWidth: 90, maxWidth: 90, objectFit: 'cover', borderRadius: 3 }} />
                                            }
                                            <div style={{ width: '100%', marginLeft: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                                <div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <p style={{ fontSize: 18 }}>{content.name}</p>
                                                    </div>
                                                    <p style={{ fontSize: 14, color: '#a4A5A8' }}>Published: <Moment format='M.DD.YYYY' date={content.createdAt} /></p>
                                                </div>
                                                <p className='page-stats' style={{ width: '80%', display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>${Math.floor(Math.random() * 9999).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                                    <span>{page.views} Views</span>
                                                    <span style={{ color: '#01ae63' }}>+{Math.floor(Math.random() * 100)}%</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            )}
                        </div>

                        {edit ?
                            <div>
                                {!this.state.submit ?
                                    <Button
                                        variant='success'
                                        size='lg'
                                        style={{ display: 'block' }}
                                        onClick={this.updatePage.bind(this)}
                                    >
                                        Update Page
                                    </Button>
                                    :
                                    <Button variant='success' className='loading' disabled>
                                        <Spinner
                                            as="span"
                                            animation="grow"
                                        />
                                        Updating Page...
                                    </Button>
                                }
                            </div>
                            :
                            <span></span>
                        }
                    </div>
                </div>
            </ReactCSSTransitionGroup >
        )
    }
}