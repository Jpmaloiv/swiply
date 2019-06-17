import React, { Component } from 'react'
import axios from 'axios'

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

     // Checks to see if user is a customer who requested page access
     componentDidMount() {
        if (window.localStorage.getItem('customer')) {
            axios.get('/api/pages/search?pageId=' + window.localStorage.getItem('pageId'))
                .then((resp) => {
                    console.log(resp)
                    this.setState({
                        page: resp.data.response[0],
                        customer: true,
                        s3Bucket: resp.data.bucket
                    })
                })
                .catch((error) => {
                    console.error(error)
                })
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
