import axios from 'axios';
import jwt_decode from 'jwt-decode';
import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import ReactHtmlParser from 'react-html-parser';


export default class ContentView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content: ''
        }
    }

    componentWillMount() {
        const loginToken = window.localStorage.getItem("token");
        if (loginToken) this.setState({ decoded: jwt_decode(loginToken) })

        axios.get('/api/content/search?id=' + this.props.match.params.contentId)
            .then((resp) => {
                console.log(resp)
                this.setState({
                    content: resp.data.response[0],
                    EMBEDLY_API_KEY: resp.data.EMBEDLY_API_KEY
                }, this.embed)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    embed() {
        axios.get(`https://api.embedly.com/1/oembed?key=${this.state.EMBEDLY_API_KEY}&url=https://www.youtube.com/watch?v=${this.state.content.link}`)
            .then((resp) => {
                console.log(resp)
                this.setState({
                    embed: resp.data.html
                })
            })
            .catch((error) => {
                console.error(error)
            })
    }



    render() {
        return (
            <ReactCSSTransitionGroup
              transitionName="fade"
              transitionAppear={true}
              transitionAppearTimeout={500}
              transitionEnter={false}
              transitionLeave={false}
            >
              <div className="main">
                <div style={{ textAlign: "center", margin: 25 }}>
                  {ReactHtmlParser(this.state.embed)}
                  </div>
                  <div style={{textAlign: 'left' }} >
                  <h4>{this.state.content.name}</h4>
                    <h5 style={{ display: "flex" }}>Content Summary</h5>
                    {this.state.summaryEdit ? (
                      <InputGroup>
                        <FormControl
                          as="textarea"
                          style={{ width: "initial" }}
                          placeholder={this.state.content.description}
                          name="summary"
                          onChange={this.handleChange}
                          onBlur={this.handleEditing}
                        />
                      </InputGroup>
                    ) : (
                      <div style={{ display: "flex" }}>

                        <p>{this.state.content.description}</p>
                      </div>
                    )}
                  </div>
                </div>
            </ReactCSSTransitionGroup>
          );
        }
      }
