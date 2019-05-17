import React, { Component } from 'react'

import Login from './Login'
import VerifyAccount from './VerifyAccount'


export default class SignIn extends Component {
    constructor(props) {
        super(props)
        this.state = {
            role: 'user',
            view: 'Login'
        }
    }


    render() {

        const { view } = this.state

        const props = {
            state: this.state,
            setState: this.setState.bind(this)
        }

        switch (view) {
            case 'Login':
                return <Login {...props} />;
            case 'VerifyAccount':
                return <VerifyAccount {...props} />;
            default:
                return null;
        }

    }
}
