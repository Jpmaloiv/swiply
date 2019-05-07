import React, { Component } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';


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
        axios.get(`https://api.embedly.com/1/oembed?key=${this.state.EMBEDLY_API_KEY}&url=https://www.youtube.com/watch?v=${this.state.content.id}`)
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
            <div style={{textAlign: 'center', margin: 25}}>
                {ReactHtmlParser(this.state.embed)}
            </div>
        )
    }
}