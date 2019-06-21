import axios from 'axios';
import jwt_decode from 'jwt-decode';
import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner'
import ReactHtmlParser from 'react-html-parser';
import Moment from 'react-moment';


export default class ContentView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      content: { File: '' },
      loading: true
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
          EMBEDLY_API_KEY: resp.data.EMBEDLY_API_KEY,
          s3Bucket: resp.data.s3Bucket
        }, this.embed)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  embed() {
    axios.get(`https://api.embedly.com/1/oembed?key=${this.state.EMBEDLY_API_KEY}&url=https://www.youtube.com/watch?v=${this.state.content.link}&data-card-recommend=0`)
      .then((resp) => {
        console.log(resp)
        this.setState({
          embed: resp.data.html,
          loading: false
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }



  render() {

    const file = this.state.content.File

    return (
      <ReactCSSTransitionGroup
        transitionName="fade"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnter={false}
        transitionLeave={false}
      >
        {this.state.loading ?
          <div className='center'>
            <Spinner animation="border" variant="success" />
          </div>
          :
          <div className="center" style={{maxWidth: 860, width: 'initial'}}>
            <div style={{ textAlign: "center", margin: '25px 0' }}>
              {ReactHtmlParser(this.state.embed)}
            <div style={{ textAlign: 'left', marginTop: 25 }} >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>{this.state.content.name}</h4>
              </div>
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

            {file ?
              // {/* List content attachments in table format */}
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <a
                  className='page'
                  href={`https://s3-us-west-1.amazonaws.com/${this.state.s3Bucket}/${file.link}`}
                  style={{ color: 'initial' }}
                >

                  <div className='page'>
                    <div style={{ display: 'flex', padding: 7.5 }}>
                      {file.type === 'video'
                        ? <img src={`https://img.youtube.com/vi/${file.link}/0.jpg`} style={{ height: 90, minWidth: 90, maxWidth: 90, objectFit: 'cover', borderRadius: 3 }} />
                        : <img src={require(`../../images/file.png`)} style={{ height: 90, minWidth: 90, maxWidth: 90, objectFit: 'cover', borderRadius: 3 }} />
                      }
                      <div style={{ width: '100%', marginLeft: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p style={{ fontSize: 18 }}>{file.name}</p>
                          </div>
                          <p style={{ fontSize: 14, color: '#a4A5A8', textAlign: 'left' }}>Published: <Moment format='M.DD.YYYY' date={file.createdAt} /></p>
                        </div>
                        <p className='page-stats' style={{ width: '80%', display: 'flex', justifyContent: 'space-between' }}>
                          <span>${Math.floor(Math.random() * 9999).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                          <span>{file.views} Views</span>
                          <span style={{ color: '#5dcbb0' }}>+{Math.floor(Math.random() * 100)}%</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
              : <span></span>
            }
            </div>
          </div>
        }
      </ReactCSSTransitionGroup>
    );
  }
}
