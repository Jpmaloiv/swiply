import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import axios from 'axios'
import jwt_decode from 'jwt-decode';
import Dropzone from 'react-dropzone'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Spinner from 'react-bootstrap/Spinner'
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
            summary: 'Page Summary',
            loading: false
        }
    }

    componentDidMount() {
        const loginToken = window.localStorage.getItem("token");
        if (loginToken) this.setState({ decoded: jwt_decode(loginToken) })
    }

    // Handles user input
    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    // Creates new content
    async addContent() {
        this.setState({ loading: true })
        let link = this.state.url.replace('https://www.youtube.com/watch?v=', '').replace('https://youtu.be/', '')
        let data = new FormData();
        if (this.state.content === 'file') data.append('imgFile', this.state.file)

        const fileId = await axios.post('/api/content/add?content=' + this.state.content + '&name=' + this.state.name + '&description=' + this.state.description + '&link=' + link + '&type=' + this.state.content +
            '&userName=' + this.state.decoded.name + '&pageId=' + this.props.match.params.pageId, data)
            .then(res => {
                console.log(res)
                if (this.state.content === 'file') window.location = `/pages/${this.props.match.params.pageId}`
                else return res.data.id
            }).catch(err => {
                console.error(err);
            })

        if (this.state.content === 'video' && this.state.file) {
            data.append('imgFile', this.state.file)
            axios.post(`/api/content/attach?fileId=${fileId}&pageId=${this.props.match.params.pageId}&userName=${this.state.decoded.name}
            &name=${this.state.fileName}&description=${this.state.fileDescription}`, data)
                .then(res => {
                    console.log(res)
                    window.location = `/pages/${this.props.match.params.pageId}`
                })
                .catch(err => console.error(err))
        }
    }

    // Displays name of uploaded file
    onFileChange = e => {
        console.log(e.target)
        this.setState({
            file: e.target.files[0],
            fileName: e.target.files[0].name
        })
    }

    onDropFile(files) {
        console.log(files)
        this.setState({
            file: files[0],
            fileName: files[0].name
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
                                <span></span>
                            }

                            <Dropzone
                                onDrop={acceptedFiles => this.onDropFile(acceptedFiles)}
                                onDragEnter={() => this.setState({ hover: true })}
                                onDragLeave={() => this.setState({ hover: false })}
                            >
                                {({ getRootProps, getInputProps }) => (
                                    <section style={{ width: '100%', marginBottom: '1rem' }}>
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            <input type='file' name='imgFile' ref={(ref) => this.upload = ref} onChange={this.onFileChange} style={{ display: 'none' }} />

                                            <div className='file-drop' style={this.state.hover ? { background: '#e0e0e0' } : null}>
                                                {this.state.fileName ?
                                                    <div>
                                                        <Button
                                                            variant='success'
                                                            size='lg'
                                                            className='circle'
                                                        // onClick={() => { this.upload.click() }}
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
                                                        // onClick={() => { this.upload.click() }}
                                                        >
                                                            <FontAwesomeIcon icon='plus' />
                                                        </Button>
                                                        <h6>Add Content</h6>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </section>
                                )}
                            </Dropzone>

                            {content === 'video' && this.state.file ?
                                <div>
                                    <Form.Group>
                                        <Form.Control
                                            placeholder='File Name'
                                            name='fileName'
                                            onChange={this.handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Control
                                            as='textarea'
                                            placeholder='Add short description...'
                                            name='fileDescription'
                                            onChange={this.handleChange}
                                        />
                                    </Form.Group>
                                </div>
                                :
                                <span></span>}

                            {!this.state.loading ?
                                <Button
                                    variant='success'
                                    onClick={this.addContent.bind(this)}
                                >
                                    Upload Content
                                </Button>
                                :
                                <Button
                                    variant='success'
                                    onClick={this.addContent.bind(this)}
                                    disabled
                                >
                                    <Spinner
                                        as="span"
                                        animation="grow"
                                        size='sm'
                                        style={{ verticalAlign: 'middle' }}
                                    />
                                    <span>Adding Content...</span>
                                </Button>
                            }
                        </Form>
                    </div>



                </div>
            </ReactCSSTransitionGroup >
        )
    }
}