import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import axios from 'axios'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'


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

    // Handles user input
    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    // Preview image once seleted
    onVideoChange = e => {
        console.log(e.target.files)
        const file = e.target.files[0]
        this.setState({
            video: URL.createObjectURL(file),
            file: file,
            fileName: file.name,
            fileType: file.type
        })
    }

    // Creates new content
    addContent() {
        let data = new FormData();
        data.append("videoFile", this.state.file)
        console.log("DATA", data)
        axios.post('/api/content/add', data)
            .then(res => {
                console.log(res)
            }).catch(err => {
                console.error(err);
            })
    }


    render() {
        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
                <div>
                    <div className='center'>
                        <h2>Add Video</h2>
                        <h5>Plese upload a video file and description for your content.</h5>

                        <Form>
                            <Form.Group>
                                <form action="/add" method="post" enctype="multipart/form-data" style={{ padding: 0 }}>
                                    <input type='file' name='videoFile' ref={(ref) => this.upload = ref} onChange={this.onVideoChange} />
                                </form>
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                    placeholder={this.state.name}
                                    name='name'
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                    as='textarea'
                                    placeholder={this.state.description}
                                    name='description'
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                        </Form>
                    </div>

                    <Button
                        variant='success'
                        size='lg'
                        style={{ display: 'block' }}
                    disabled
                        onClick={this.addContent.bind(this)}
                    >
                        Upload Content
                    </Button>
                </div>
            </ReactCSSTransitionGroup>
        )
    }
}