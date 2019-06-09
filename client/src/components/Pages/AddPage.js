import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import axios from 'axios'
import jwt_decode from 'jwt-decode'

import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default class AddPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            image: '',
            name: 'Page Name',
            description: 'Short Description',
            summary: 'Page Summary'
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
        const page = this.state;

        let file = page.file
        // Split the filename to get the name and type
        let fileParts = file.name.split('.');
        let fileName = fileParts[0];
        let fileType = fileParts[1];
        console.log("Preparing the upload", file);
        let data = new FormData();
        data.append("imgFile", file)
        axios.post('/api/pages/add?userId=' + page.decoded.id + '&name=' + page.name + '&description=' + page.description +
            '&summary=' + page.summary + '&fileName=' + fileName + '&fileType=' + fileType, data)
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
                        <div style={{ position: 'absolute', bottom: 45, right: 95 }}>
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
                                        style={{ width: 'initial' }}
                                        placeholder={this.state.name}
                                        name='name'
                                        onChange={this.handleChange}
                                        onBlur={this.handleEditing}
                                    />
                                </InputGroup>
                                :
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <p style={{ fontSize: 20 }} className='page-name' style={{ fontSize: 60 }}>{this.state.name}</p>
                                    <FontAwesomeIcon icon='pen' name='name' onClick={this.handleEditing} />
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
                                    <p style={{ fontSize: 20 }}>{this.state.description}</p>
                                    <FontAwesomeIcon icon='pen' name='description' onClick={this.handleEditing} />
                                </div>
                            }
                        </div>
                    </div>

                    <div className='main'>
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
                                    <h4>{this.state.summary}</h4>
                                    <FontAwesomeIcon icon='pen' name='summary' onClick={this.handleEditing} />
                                </div>
                            }
                        </div>
                        <Button
                            variant='success'
                            size='lg'
                            style={{ display: 'block' }}
                            onClick={this.addPage.bind(this)}
                        >
                            + Add Page
                        </Button>
                    </div>
                </div>
            </ReactCSSTransitionGroup>
        )
    }
}