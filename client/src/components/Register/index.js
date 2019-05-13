import React, { Component } from 'react'

import CreateAccount from './CreateAccount'
import VerifyAccount from './VerifyAccount'
import ProfileSummary from './ProfileSummary'
import SubscriptionPlan from './SubscriptionPlan'


export default class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            view: 'CreateAccount',
            firstName: '',
            lastName: '',
            summary: ''
        }
    }


    render() {

        const { view } = this.state

        const props = {
            state: this.state,
            setState: this.setState.bind(this)
        }

        switch (view) {
            case 'CreateAccount':
                return <CreateAccount {...props} />;
            case 'VerifyAccount':
                return <VerifyAccount {...props} />;
            case 'ProfileSummary':
                return <ProfileSummary {...props} />;
            case 'SubscriptionPlan':
                return <SubscriptionPlan {...props} />;
            default:
                return null;
        }

    }
}
