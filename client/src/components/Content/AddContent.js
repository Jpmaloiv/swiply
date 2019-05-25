import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import axios from 'axios'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Form from 'react-bootstrap/Form'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default class AddContent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content: 'video',
            video: '',
            url: '',
            name: 'Page Name',
            description: 'Add short description...',
            summary: 'Page Summary'
        }
    }

    // Handles user input
    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    // Creates new content
    addContent() {
        let id = this.state.url.replace('https://www.youtube.com/watch?v=', '').replace('https://youtu.be/', '')
        let data = new FormData();
        data.append('imgFile', this.state.file)
        axios.post('/api/content/add?id=' + id + '&name=' + this.state.name + '&description=' + this.state.description + '&type=' + this.state.content +
            '&pageId=' + this.props.match.params.pageId, data)
            .then(res => {
                console.log(res)
                window.location = `/pages/${this.props.match.params.pageId}`
            }).catch(err => {
                console.error(err);
            })
    }

    // Displays name of uploaded file
    onFileChange = e => {
        console.log(e.target.files[0])
        this.setState({
            file: e.target.files[0],
            fileName: e.target.files[0].name
        })
    }


    render() {

        const { content } = this.state;
        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
                <div>
                    <div className='center'>
                        <h2>Add Content</h2>
                        <ButtonGroup style={{ width: '100%' }}>
                            <Button
                                variant='link'
                                active={content === 'video'}
                                onClick={() => this.setState({ content: 'video' })}
                            >
                                Add Video
                            </Button>
                            <Button
                                variant='link'
                                active={content === 'file'}
                                onClick={() => this.setState({ content: 'file' })}
                            >
                                Add File
                            </Button>
                        </ButtonGroup>

                        {content === 'video' ?
                            <div>
                                <h2>Add Video</h2>
                                <h5>Plese link an online video and add a description for your content.</h5>
                            </div>
                            :
                            <div>
                                <h2>Add File</h2>
                                <h5>Plese upload a file and add a description for your content.</h5>
                            </div>
                        }
                        <br />
                        <Form style={{ padding: 0, margin: '0 75px' }}>
                            <Form.Group>
                                <Form.Control
                                    placeholder={content === 'video' ? 'Video Name' : 'File Name'}
                                    name='name'
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                    as='textarea'
                                    placeholder='Add short description...'
                                    name='description'
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            {content === 'video' ?
                                <Form.Group>
                                    <Form.Control
                                        placeholder='Add URL'
                                        name='url'
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                :
                                <div style={{ display: 'flex', height: 90, alignItems: 'center', justifyContent: 'center', border: '1px dashed #D8D8D7' }}>
                                    <input type='file' name='imgFile' ref={(ref) => this.upload = ref} onChange={this.onFileChange} style={{ display: 'none' }} />
                                    {this.state.fileName ?
                                        <div>
                                            <Button
                                                variant='success'
                                                size='lg'
                                                className='circle'
                                                onClick={() => { this.upload.click() }}
                                            >
                                            <FontAwesomeIcon icon='check' />
                                            </Button>
                                            {this.state.fileName}
                                        </div>
                                        :
                                        <div>
                                            <Button
                                                variant='success'
                                                size='lg'
                                                className='circle'
                                                onClick={() => { this.upload.click() }}
                                            >
                                                <FontAwesomeIcon icon='plus' />
                                            </Button>
                                            <h6>Add Content</h6>
                                        </div>
                                    }
                                </div>
                            }
                            <Button
                                variant='success'
                                onClick={this.addContent.bind(this)}
                            >
                                Next
                            </Button>
                        </Form>
                    </div>



                </div>
            </ReactCSSTransitionGroup >
        )
    }
}