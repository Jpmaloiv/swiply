import axios from "axios";
import jwt_decode from "jwt-decode";
import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";

var stripe = window.Stripe('pk_test_J71dqS8brtNIK1ZYN7LCiJvd00D8Kbx2K8');
var elements = stripe.elements({
    fonts: [
        {
            family: 'Open Sans',
            weight: 400,
            src: 'local("Open Sans"), local("OpenSans"), url(https://fonts.gstatic.com/s/opensans/v13/cJZKeOuBrn4kERxqtaUH3ZBw1xU1rKptJj_0jans920.woff2) format("woff2")',
            unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215',
        },
    ]
});

function setOutcome(result) {
    var successElement = document.querySelector('.success');
    var errorElement = document.querySelector('.error');
    successElement.classList.remove('visible');
    errorElement.classList.remove('visible');

    if (result.token) {
        // Use the token to create a charge or a customer
        // https://stripe.com/docs/charges
        successElement.querySelector('.token').textContent = result.token.id;
        successElement.classList.add('visible');
    } else if (result.error) {
        errorElement.textContent = result.error.message;
        errorElement.classList.add('visible');
    }
}

const createOptions = () => {
    return {
        style: {
            base: {
                background: 'white',
                boxSizing: 'border-box',
                fontWeight: 400,
                border: '1px solid #CFD7DF',
                borderRadius: '24px',
                color: '#32315E',
                outline: 'none',
                // -webkit-flex: 1 1,
                flex: '1 1',
                height: '48px',
                lineHeight: '48px',
                padding: '0 20px',
                cursor: 'text',
                //   fontSize: "16px",
                //   color: "#424770",
                //   fontFamily: "Open Sans, sans-serif",
                //   letterSpacing: "0.025em",
                //   "::placeholder": {
                //     color: "#aab7c4"
                //   }
            },
            invalid: {
                color: "#c23d4b"
            }
        }
    };
};


class Checkout extends Component {
    constructor(props) {
        super(props)
        this.state = {
            card: '',
            page: "",
            errorMessage: "",
            time: "",
            unixTime: ""
        }

    }


    componentWillMount() {
        const loginToken = window.localStorage.getItem("token");
        if (loginToken) this.setState({ decoded: jwt_decode(loginToken) });
        console.log(loginToken);
        console.log(window.localStorage.getItem("customer"), "COMMENT!");
        if (window.localStorage.getItem("customer")) {
            axios.get("/api/pages/search?pageId=" + window.localStorage.getItem("pageId"))
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
        function timeConverter(UNIX_timestamp) {
            var a = new Date(UNIX_timestamp * 1000);
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();
            var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
            return time;
        };

        ev.preventDefault();

        this.props.stripe
            .createPaymentMethod('card', { billing_details: { name: 'Jenny Rosen' } })
            .then(({ paymentMethod }) => {
                console.log('Received Stripe PaymentMethod:', paymentMethod);
            });

        // You can also use handleCardPayment with the Payment Intents API automatic confirmation flow.
        // See our handleCardPayment documentation for more:
        // https://stripe.com/docs/stripe-js/reference#stripe-handle-card-payment
        //   this.props.stripe.handleCardPayment('{PAYMENT_INTENT_CLIENT_SECRET}', data);

        // You can also use createToken to create tokens.
        // See our tokens documentation for more:
        // https://stripe.com/docs/stripe-js/reference#stripe-create-token
        // this.props.stripe.createToken({ type: 'card', name: 'Jenny Rosen' })
        // .then(({token }) => {
        //     console.log(token)
        // })
        // .catch(err => {
        //     console.log(err);
        // });

        this.props.stripe
            .createSource({
                type: "card",
                owner: {
                    name: "Jenny Rosen"
                },
                amount: Number(this.state.price) * 100
            })
            .then(({ source }) => {
                console.log(source)
                const convertedUnix = timeConverter(source.created)
                console.log("Source:", source);
                console.log("Unix Time:", timeConverter(source.created));
                this.setState({
                    time: convertedUnix
                })
                console.log(convertedUnix, "Time!")
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


    componentDidMount() {
        var card = elements.create('card', {
            hidePostalCode: true,
            style: {
                base: {
                    iconColor: '#F99A52',
                    color: '#32315E',
                    lineHeight: '48px',
                    fontWeight: 400,
                    fontFamily: '"Open Sans", "Helvetica Neue", "Helvetica", sans-serif',
                    fontSize: '15px',

                    '::placeholder': {
                        color: '#CFD7DF',
                    }
                },
            }
        });
        card.mount('#card-element');

        this.setState({ card: card }, () => console.log(this.state.card))

    }

    handleSubmit(e) {
        e.preventDefault();
        var form = document.querySelector('form');
        var extraDetails = {
            name: form.querySelector('input[name=cardholder-name]').value,
            address_zip: form.querySelector('input[name=address-zip]').value
        };
        stripe.createToken(this.state.card, extraDetails).then(this.setOutcome);
    };



    render() {

        const { card, page } = this.state

        if (this.state.card) {
            card.on('change', function (event) {
                console.log(this)
                setOutcome(event);
            });
        }

        return (
            <div>
                <script src="https://js.stripe.com/v3/"></script>
                <body>
                    <form className='stripe'>
                        <label>
                            <span>Name</span>
                            <input name="cardholder-name" class="field" placeholder={this.state.decoded.name} />
                        </label>
                        <label>
                            <span>Phone</span>
                            <input class="field" placeholder="(123) 456-7890" type="tel" />
                        </label>
                        <label>
                            <span>Note to Seller</span>
                            <input name="address-zip" class="field" placeholder="Hey! Looking forward to viewing..." />
                        </label>
                        <label style={{display: 'none'}}>
                            <div id="card-element" class="field"></div>
                        </label>

                        <CardElement id='card-element' className='field' onChange={this.handleChange} {...createOptions()} />



                        <button type="submit" onClick={this.handleSubmit.bind(this)} style={{width: '70%'}}>Pay ${page.price}</button>

                        <div class="outcome">
                            <div class="error"></div>
                            <div class="success">
                                Success! Your Stripe token is <span class="token"></span>
                            </div>
                        </div>
                        {/* <CardElement id='card-element' class='field' onChange={this.handleChange} {...createOptions()} /> */}

                    </form>
                    {this.state.customer ? (
                        <div style={{ textAlign: "center" }}>
                            <div
                                className="page"
                                style={{ display: "flex", flex: "initial", margin: "1em auto" }}
                            >
                                <div style={{ display: 'flex', padding: 7.5 }}>

                                    <img
                                        src={`https://s3-us-west-1.amazonaws.com/${
                                            this.state.s3Bucket
                                            }/${page.imageLink}`}
                                        style={{ height: 90, minWidth: 90, maxWidth: 90, objectFit: 'cover', borderRadius: 3 }}
                                    />
                                    <div style={{ width: "100%", textAlign: "left", display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 20 }}>
                                        <p style={{ fontSize: 18, whiteSpace: 'nowrap' }}>{page.name}</p>
                                        <p className='previewText'>
                                            {page.summary}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                            <span />
                        )}
                </body>
            </div>

        )
    }
}

export default injectStripe(Checkout);
