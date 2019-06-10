import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'


export default class VerifyAccount extends Component {

    // Handle user input
    handleChange = e => {
        this.props.setState({ [e.target.name]: e.target.value });
    };

    enterPressed(event) {
        var code = event.keyCode || event.which;
        if (code === 13) {
            this.next.click()
        }
    }
 

    render() {
        return (
            <ReactCSSTransitionGroup transitionName='fade' transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
                <div className='center'>
                    <h3>Create a profile summary</h3>
                    <br />
                    <Form style={{ paddingTop: 0, paddingBottom: 0 }}>
                        <Form.Group>
                            <Form.Label>Content Provider Summary</Form.Label>
                            <Form.Control
                                as='textarea'
                                rows='4'
                                placeholder='I grew up in Arizona and moved to SF when I was 5...'
                                name='summary'
                                onChange={this.handleChange}
                                onKeyPress={this.enterPressed.bind(this)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Add categories of content you will offer</Form.Label>
                            <Form.Control
                                as='textarea'
                                rows='4'
                                placeholder='Add a category'
                                name='category'
                                onChange={this.handleChange}
                                onKeyPress={this.enterPressed.bind(this)}

                            />
                        </Form.Group>
                    </Form>

                    <Button variant='success' size='lg' onClick={() => this.props.setState({ view: 'SubscriptionPlan' })} ref={ref => (this.next = ref)}>
                        Next
                </Button>
                </div>
            </ReactCSSTransitionGroup>
        )
    }
}
