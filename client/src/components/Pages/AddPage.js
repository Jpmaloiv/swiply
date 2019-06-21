import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import axios from 'axios'
import jwt_decode from 'jwt-decode'

import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import Spinner from 'react-bootstrap/Spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default class AddPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            image: '',
            name: 'Page Name',
            description: 'Short Description',
            summary: 'Page Summary',
            submit: false
        }
    }

    componentWillMount() {
        const loginToken = window.localStorage.getItem("token");
        if (loginToken) {
            this.setState({ decoded: jwt_decode(loginToken) })
        }
    }

    // Handles user input
    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    // Controls editing state
    handleEditing = e => {
        let name = e.currentTarget.getAttribute('name') + 'Edit'
        this.setState({ [name]: !this.state[name] });
    }

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

    // Creates a new page
    addPage() {
        this.setState({ submit: true })
        const page = this.state;
        let file, data
        if (page.file) {
            file = page.file
            let form = new FormData();
            form.append("imgFile", file)
            data = form
        }
        axios.post('/api/pages/add?userId=' + page.decoded.id + '&name=' + page.name + '&description=' + page.description +
            '&summary=' + page.summary, data)
            .then((response) => {
                console.log(response)
                window.location = '/'
            }).catch((error) => {
                console.error(error);
            })
    }

    render() {
        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
                <div>
                    <div className={this.state.image === '' ? 'imageBanner' : 'imageBanner set'}>
                        <form action="/add" method="post" enctype="multipart/form-data" style={{ padding: 0 }}>
                            <input type='file' name='imgFile' ref={(ref) => this.upload = ref} onChange={this.onImageChange} style={{ display: 'none' }} />
                        </form>
                        <img src={this.state.image} style={{ width: '100%', opacity: .2 }} alt='' />
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

                        <div className='textOverlay'>
                            {this.state.nameEdit ?
                                <InputGroup>
                                    <FormControl
                                        placeholder={this.state.name}
                                        name='name'
                                        className='page-name edit'
                                        onChange={this.handleChange}
                                        onBlur={this.handleEditing}
                                        autoFocus
                                    />
                                </InputGroup>
                                :
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <p className='page-name' style={{ fontSize: 60 }}>{this.state.name}</p>
                                    <FontAwesomeIcon icon='pen' name='name' onClick={this.handleEditing} />
                                </div>
                            }
                            {this.state.descriptionEdit ?
                                <FormControl
                                    style={{ width: 'initial', margin: '0 auto' }}
                                    placeholder={this.state.description}
                                    name='description'
                                    onChange={this.handleChange}
                                    onBlur={this.handleEditing}
                                    autoFocus
                                />
                                :
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <p style={{ fontSize: 20 }}>{this.state.description}</p>
                                    <FontAwesomeIcon icon='pen' name='description' onClick={this.handleEditing} />
                                </div>
                            }
                        </div>
                    </div>

                    <div className='main'>
                        <div>
                            <InputGroup>
                                <FormControl
                                    as='textarea'
                                    rows={4}
                                    style={{ width: 'initial' }}
                                    placeholder={this.state.summary}
                                    name='summary'
                                    onChange={this.handleChange}
                                />
                            </InputGroup>
                        </div>
                        {!this.state.submit ?
                            <Button
                                variant='success'
                                size='lg'
                                style={{ display: 'block' }}
                                onClick={this.addPage.bind(this)}
                            >
                                + Add Page
                            </Button>
                            :
                            <Button variant='success' className='loading' disabled>
                                <Spinner
                                    as="span"
                                    animation="grow"
                                />
                                Creating Page...
                            </Button>
                        }
                    </div>
                </div>
            </ReactCSSTransitionGroup>
        )
    }
}