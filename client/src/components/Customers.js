import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import jwt_decode from "jwt-decode";
import React, { Component } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import { NavLink } from "react-router-dom";


export default class CustomerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stats: [],
      pages: [],
      charges: [],
      customerName: '',
      sort: 'date',
      sortTitle: 'Recent Customers'
    };
    this.searchQuery = this.searchQuery.bind(this);
  }

  componentWillMount() {
    const loginToken = window.localStorage.getItem("token");
    let decoded = "";
    if (loginToken) decoded = jwt_decode(loginToken);

    axios
      .get(`api/charges/search?id=${decoded.id}&sort=${this.state.sort}`)
      .then(resp => {
        console.log(resp);
        this.setState({
          charges: resp.data.response,
          decoded: decoded,
          S3_BUCKET: resp.data.bucket
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  enterPressed(event) {
    var code = event.keyCode || event.which;
    if (code === 13) {
      this.searchQuery();
    }
  }

  searchQuery() {
    axios.get(`api/charges/search?id=${this.state.decoded.id}&name=${this.state.customer}`)
      .then(resp => {
        console.log(resp);
        this.setState({ charges: resp.data.response })
      })
      .catch(err => {
        console.error(err);
      });
  }

  sortCustomers() {
    axios.get(`api/charges/search?id=${this.state.decoded.id}&sort=${this.state.sort}`)
        .then((resp) => {
          console.log(resp)
            this.setState({
                charges: resp.data.response,
                S3_BUCKET: resp.data.bucket
            })
        })
        .catch((error) => {
            console.error(error)
        })
}

  render() {

    const { sort } = this.state

    return (
      <ReactCSSTransitionGroup
        transitionName="fade"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnter={false}
        transitionLeave={false}
      >
        <div style={{ borderBottom: '1px solid #ebecef' }}>
          <div className='main'>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flex: 0.2,
                justifyContent: "center"
              }}
            >
              <InputGroup>
                <FormControl
                  style={{ height: 45, borderTopLeftRadius: 22.5, borderBottomLeftRadius: 22.5, borderRight: 'none' }}
                  placeholder='Search Your Customers ...'
                  onChange={e => this.setState({ customer: e.target.value })}
                  onKeyPress={this.enterPressed.bind(this)}
                />
                <InputGroup.Append>
                  <InputGroup.Text style={{ background: '#fff', borderTopRightRadius: 22.5, borderBottomRightRadius: 22.5 }}>
                    <FontAwesomeIcon icon='search' style={{ opacity: 0.2 }} onClick={this.searchQuery} />
                  </InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </div>
          </div>
        </div>
        <div
          style={{ backgroundColor: "#f9fafc", height: '100%', borderTop: "1px solid #ebecef" }}
        >
          <div className="main">
            <div
              style={{
                display: "flex",
                margin: "20px auto"
              }}
            >
              <div>
                <DropdownButton title={this.state.sortTitle} className='plain' variant='secondary'>
                  <Dropdown.Item onClick={() => this.setState({ sort: 'date', sortTitle: 'Recent Customer' }, this.sortCustomers)} active={sort === 'date'}>Recent Customers</Dropdown.Item>
                  <Dropdown.Item onClick={() => this.setState({ sort: 'purchases', sortTitle: 'Pages Purchased' }, this.sortCustomers)} active={sort === 'purchases'}>Pages Purchased</Dropdown.Item>
                  <Dropdown.Item onClick={() => this.setState({ sort: 'revenue', sortTitle: 'Highest Value' }, this.sortCustomers)} active={sort === 'revenue'}>Highest Value</Dropdown.Item>
                </DropdownButton>
              </div>
            </div>

            {/* List pages in table format */}
            <div style={{ display: "flex", flex: 1, justifyContent: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", width: '100%' }}>
                {this.state.charges.map((charge, i) => (
                  <NavLink
                    to={`/customers/${charge.Customer.id}`}
                    style={{ color: "initial" }}
                  >
                    <div key={i} className="page" style={{ display: "flex", padding: 18, margin: '7.5px auto', alignItems: 'center', width: 'initial' }}>
                      {charge.Customer.imageLink ?
                        <img
                          src={`https://s3-us-west-1.amazonaws.com/${this.state.S3_BUCKET}/${charge.Customer.imageLink}`}
                          style={{
                            minWidth: 75, maxWidth: 75, height: 75, marginRight: 20, borderRadius: '50%', objectFit: 'cover'
                          }}
                        />
                        : <img src={require('../images/default-user.png')} style={{
                          minWidth: 70, maxWidth: 70, height: 75, marginRight: 20, borderRadius: '50%', objectFit: 'cover'
                        }} />
                      }

                      <div style={{ width: "100%" }}>
                        <p style={{ fontSize: 18 }}>
                          {charge.Customer.firstName || charge.Customer.lastName
                            ? <span>{charge.Customer.firstName} {charge.Customer.lastName} {charge.createdAt}</span>
                            : <span>Customer</span>}
                        </p>
                        <p style={{ color: '#88898c' }}>Item: {charge.Page.name}</p>

                        <p style={{ alignItems: "left" }}>
                          <span style={{ fontSize: 14 }}>Status: </span>
                          <span style={{ fontSize: 14, color: "#5dcbb0" }}>
                            Paid
                          </span>
                        </p>
                      </div>
                    </div>
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ReactCSSTransitionGroup>
    );
  }
}
