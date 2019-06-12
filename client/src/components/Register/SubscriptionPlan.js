import axios from "axios";
import React, { Component } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import Button from "react-bootstrap/Button";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";


export default class SubscriptionPlan extends Component {
  // Register the new user
  register() {
    const user = this.props.state;
    if (user.password === user.confirmpw) {
      let data = new FormData();
      data.append("imgFile", user.file);
      axios
        .post(
          "api/users/register?firstName=" +
            user.firstName +
            "&lastName=" +
            user.lastName +
            "&email=" +
            user.email +
            "&password=" +
            user.password +
            "&summary=" +
            user.summary,
          data
        )
        .then(resp => {
          console.log(resp);
          window.localStorage.setItem("token", resp.data.token);
          window.location.reload();
        })
        .catch(error => {
          console.error(error);
        });
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
        <div className="center">
        <ToggleButtonGroup vertical name='subscription' className='subscription-plan'>
            <ToggleButton variant="light">
              <h4>Small Plan</h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <h4>$0 Per Month</h4>
            </ToggleButton>
            <ToggleButton variant="light">
              <h4>Medium Plan</h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <h4>$199 Per Month</h4>
            </ToggleButton>
            <ToggleButton variant="light">
              <h4>Pro Plan</h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <h4>$399 Per Month</h4>
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="success"
            size="lg"
            onClick={this.register.bind(this)}
          >
            Register
          </Button>
        </div>
      </ReactCSSTransitionGroup>
    );
  }
}
