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

    // Handles user input
    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    // Creates new content
    addContent() {
        let id = this.state.url.replace('https://www.youtube.com/watch?v=', '').replace('https://youtu.be/','')
        axios.post('/api/content/add?id=' + id + '&name=' + this.state.name + '&description=' + this.state.description +
        '&pageId=' + this.props.match.params.pageId)
            .then(res => {
                console.log(res)
                window.location = `/pages/${this.props.match.params.pageId}`
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
                        <h5>Plese link an online video and add a description for your content.</h5>

                        <Form>
                            <Form.Group>
                                <Form.Control
                                    placeholder='Video Name'
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
                            <Form.Group>
                                <Form.Control
                                    placeholder='Add URL'
                                    name='url'
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                        </Form>
                    </div>

                    <Button
                        variant='success'
                        size='lg'
                        style={{ display: 'block' }}
                        onClick={this.addContent.bind(this)}
                    >
                        Add Content
                    </Button>
                </div>
            </ReactCSSTransitionGroup>
        )
    }
}