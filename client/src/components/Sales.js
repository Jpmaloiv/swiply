import React, { Component } from 'react'
import jwt_decode from "jwt-decode";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import axios from 'axios'
import Button from "react-bootstrap/Button";


export default class Sales extends Component {


    async componentWillMount() {
        const loginToken = window.localStorage.getItem("token");
        let decoded = "";
        if (loginToken) decoded = jwt_decode(loginToken);

        if (decoded.role === "user") {
            const accountId = await axios.get(`/api/users/search?id=` + decoded.id)
                .then(resp => {
                    console.log(resp)
                    return resp.data.response[0].accountId
                })
                .catch(error => {
                    console.error(error);
                });

            axios.post(`/api/stripe/login?accountId=${accountId}`)
                .then((resp) => {
                    console.log("RESP", resp)
                    this.setState({
                        stripeLink: resp.data.stripeLink
                    })
                }).catch((error) => {
                    console.error(error);
                })
        }
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
                <div className='center'>
                    <Button
                        variant='success'
                        onClick={() => window.open(this.state.stripeLink)}
                    >View Sales Information
                </Button>
                </div>
            </ReactCSSTransitionGroup>
        )
    }
}