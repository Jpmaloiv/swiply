import React, { Component } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { NavLink } from 'react-router-dom'
import Moment from 'react-moment';


import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default class PageView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            image: '',
            name: 'Page Name',
            description: 'Short Description',
            summary: 'Page Summary',
            page: { Contents: [] },
            edit: false
        }
    }

    componentWillMount() {
        const loginToken = window.localStorage.getItem("token");
        if (loginToken) this.setState({ decoded: jwt_decode(loginToken) })

        axios.get('/api/pages/search?pageId=' + this.props.match.params.pageId)
            .then((resp) => {
                console.log(resp)
                this.setState({
                    page: resp.data.response[0],
                    image: `https://s3-us-west-1.amazonaws.com/${resp.data.bucket}/${resp.data.response[0].imageLink}`
                }, this.checkSelf)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    checkSelf() {
        if (this.state.decoded.id === this.state.page.UserId) this.setState({ edit: true })
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

    // Updates page with any changes made
    updatePage() {
        const { page } = this.state;

        // let file = page.file
        // // Split the filename to get the name and type
        // let fileParts = file.name.split('.');
        // let fileName = fileParts[0];
        // let fileType = fileParts[1];
        // console.log("Preparing the upload", file);
        // let data = new FormData();
        // data.append("imgFile", file)
        axios.put('/api/pages/update?id=' + page.id + '&name=' + page.name + '&description=' + page.description +
            '&summary=' + page.summary + '&price=' + page.price)
            .then(res => {
                console.log(res)
                window.location.reload();
            }).catch(err => {
                console.error(err);
            })
    }


    render() {

        const { edit, page } = this.state

        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
                <div>
                    <div className='imageBanner set'>
                        <input type='file' ref={(ref) => this.upload = ref} onChange={this.onImageChange} style={{ display: 'none' }} />
                        <img src={this.state.image} style={{ width: '100%', opacity: .3 }} alt='' />

                        {this.state.edit ?
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
                            :
                            <span></span>
                        }

                        <div className='textOverlay'>
                            {this.state.image ?
                                <span></span>
                                :
                                <FontAwesomeIcon
                                    icon='plus'
                                    size='6x'
                                    style={{ opacity: .1 }}
                                    onClick={() => { this.upload.click() }}
                                />
                            }
                            {this.state.nameEdit ?
                                <InputGroup>
                                    <FormControl
                                        style={{ width: 'initial' }}
                                        placeholder={this.state.name}
                                        name='name'
                                        onChange={this.handleChange}
                                        onBlur={this.handleEditing}
                                    />
                                </InputGroup>
                                :
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <h3>{page.name}</h3>
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
                                />
                                :
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <p>{page.description}</p>
                                    {edit ?
                                        <FontAwesomeIcon icon='pen' name='description' onClick={this.handleEditing} />
                                        :
                                        <span></span>
                                    }
                                </div>
                            }
                            <Button
                                variant='success'
                                size='lg'
                            >
                                {this.state.priceEdit ?
                                    <FormControl
                                        style={{ width: 'initial' }}
                                        placeholder="Amount or 'Free'"
                                        name='price'
                                        onChange={this.handleChange}
                                        onBlur={this.handleEditing}
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
                            </Button>
                        </div>
                    </div>

                    <div className='main'>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 35 }}>
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
                        <div>
                            {this.state.summaryEdit ?
                                <InputGroup>
                                    <FormControl
                                        as='textarea'
                                        style={{ width: 'initial' }}
                                        placeholder={this.state.summary}
                                        name='summary'
                                        onChange={this.handleChange}
                                        onBlur={this.handleEditing}
                                    />
                                </InputGroup>
                                :
                                <div style={{ display: 'flex' }}>
                                    <p>{page.summary}</p>
                                    {edit ?
                                        <FontAwesomeIcon icon='pen' name='summary' onClick={this.handleEditing} />
                                        :
                                        <span></span>
                                    }
                                </div>
                            }
                        </div>

                        {/* List pages in table format */}
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {this.state.page.Contents.map((content, i) =>
                                <NavLink to={`/pages/${this.props.match.params.pageId}/${content.id}`} style={{ color: 'initial' }}>

                                    <div key={i} className='page' style={{ display: 'flex' }}>
                                        <img src={`https://img.youtube.com/vi/${content.id}/0.jpg`} style={{ width: 75, objectFit: 'cover', marginRight: 20 }} />
                                        <div style={{ width: '100%' }}>
                                            <p>{content.name}</p>
                                            <p style={{ fontSize: 14, color: '#a4A5A8' }}>Published: <Moment format='M.DD.YYYY' date={content.createdAt} /></p>
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


                        <Button
                            variant='success'
                            size='lg'
                            style={{ display: 'block' }}
                            onClick={this.updatePage.bind(this)}
                        >
                            Update Page
                        </Button>
                    </div>
                </div>
            </ReactCSSTransitionGroup>
        )
    }
}