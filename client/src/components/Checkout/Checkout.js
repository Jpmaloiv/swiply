import axios from "axios";
import jwt_decode from "jwt-decode";
import { Component, default as React } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";

const createOptions = () => {
  return {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        fontFamily: "Open Sans, sans-serif",
        letterSpacing: "0.025em",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#c23d4b"
      }
    }
  };
};
class Checkout extends Component {
  state = {
    page: "",
    errorMessage: ""
  };


  componentWillMount() {
    const loginToken = window.localStorage.getItem("token");
    if (loginToken) this.setState({ decoded: jwt_decode(loginToken) });
    console.log(loginToken);
    console.log(window.localStorage.getItem("customer"), "COMMENT!");
    if (window.localStorage.getItem("customer")) {
      axios
        .get(
          "/api/pages/search?pageId=" + window.localStorage.getItem("pageId")
        )
        .then(resp => {
          this.setState({
            price: resp.data.response[0].price,
            page: resp.data.response[0],
            customer: true,
            s3Bucket: resp.data.bucket
          });
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  handleChange = ({ error }) => {
    if (error) {
      this.setState({ errorMessage: error.message });
    }
  };

  handleSubmit = ev => {
    ev.preventDefault();

    this.props.stripe
      .createSource({
        type: "card",
        owner: {
          name: "Jenny Rosen"
        },
        amount: Number(this.state.price) * 100
      })
      .then(({ source }) => {
        console.log("Source:", source);
        axios
          .post(
            `api/auth/page?customerId=${
              this.state.decoded.id
            }&pageId=${window.localStorage.getItem("pageId")}, data`
          )
          .then(resp => {
            console.log(resp);
            window.location = "/purchased";
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(err => {
        console.log(err);
      });
  };
  render() {
    const { page } = this.state;

    return (
      <div className="center">
        <form onSubmit={this.handleSubmit}>
          <label style={{ width: 250 }}>
            Card details
            <CardElement onChange={this.handleChange} {...createOptions()} />
          </label>
          <div className="error" role="alert">
            {this.state.errorMessage}
          </div>
          <button onClick={this.handleSubmit}>Confirm order</button>
        </form>
        {this.state.customer ? (
          <div style={{ textAlign: "center" }}>
            <div
              className="page"
              style={{ display: "flex", flex: "initial", margin: "1em auto" }}
            >
              <img
                src={`https://s3-us-west-1.amazonaws.com/${
                  this.state.s3Bucket
                }/${page.imageLink}`}
                style={{ width: 75, objectFit: "cover", marginRight: 20 }}
              />
              <div style={{ width: "100%", textAlign: "left" }}>
                <h4>{page.name}</h4>
                <p>{page.description}</p>
              </div>
              <div>${page.price}</div>
            </div>
          </div>
        ) : (
          <span />
        )}
      </div>
    );
  }
}

export default injectStripe(Checkout);
