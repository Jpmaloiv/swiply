import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import axios from 'axios'

import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default class AddContent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            video: '',
            name: 'Page Name',
            description: 'Add short description...',
            summary: 'Page Summary'
        }
    }

    componentWillMount() {

    }


    // Creates new content
    addContent() {

    }


    render() {
        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
                <div>
                    <div className={this.state.video === '' ? 'imageBanner' : 'imageBanner set'}>
                        <h2>Add Video</h2>
                        <h5>Plese upload a video file and description for your content.</h5>
                        <form action="/add" method="post" enctype="multipart/form-data" style={{ padding: 0 }}>
                            <input type='file' name='imgFile' ref={(ref) => this.upload = ref} onChange={this.onImageChange} style={{ display: 'none' }} />
                        </form>
                        {/* <img src={this.state.image} style={{ width: '100%', opacity: .2 }} alt='' /> */}

                        <div className='textOverlay'>
                            {this.state.video ?
                                <span></span>
                                :
                                <FontAwesomeIcon
                                    icon='plus'
                                    size='6x'
                                    style={{ opacity: .2 }}
                                    onClick={() => { this.upload.click() }}
                                />
                            }

                                <FormControl
                                    style={{ width: 'initial' }}
                                    placeholder={this.state.description}
                                    name='description'
                                    onChange={this.handleChange}
                                    onBlur={this.handleEditing}
                                />
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <p>{this.state.description}</p>
                                    <FontAwesomeIcon icon='pen' name='description' onClick={this.handleEditing} />
                                </div>
                        </div>
                    </div>

                    <div className='main'>
                        <Button
                            variant='success'
                            size='lg'
                            style={{ display: 'block' }}
                            onClick={this.addPage.bind(this)}
                        >
                            Upload Content
                        </Button>
                    </div>
                </div>
            </ReactCSSTransitionGroup>
        )
    }
}