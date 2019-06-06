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
      customers: [],
      customerName: ""
    };
    this.searchQuery = this.searchQuery.bind(this);
  }

  componentWillMount() {
    const loginToken = window.localStorage.getItem("token");
    let decoded = "";
    if (loginToken) decoded = jwt_decode(loginToken);

    axios
      .get("api/customers/search?userId=" + decoded.name)
      .then(resp => {
        console.log(resp);
        this.setState({
          customers: resp.data.response,
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
      //13 is the enter keycode
      this.searchQuery();
    }
  }

  searchQuery() {
    let customerName = "";
    if (this.state.customerName) customerName = this.state.customerName;
    const loginToken = window.localStorage.getItem("token");
    axios
      .get("api/customers/search?customername=" + customerName, {
        headers: { Authorization: "Bearer " + loginToken }
      })
      .then(resp => {
        console.log(resp.data.response);
        this.setState(
          {
            patients: resp.data.response
          },
          () => console.log(this.state.customers)
        );
      })
      .catch(error => {
        console.error(error);
      });
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
        <div
          style={{ backgroundColor: "#f9fafc", borderTop: "1px solid #ebecef" }}
        >
          <div className="main">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                justifyContent: "center",
                margin: "20px auto"
              }}
            >
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
                    style={{ height: 45, borderTopLeftRadius: 22.5, borderBottomLeftRadius: 22.5, borderRight: 'none'}}
                    placeholder='Search Your Customers ...'
                    onChange={event => {
                      this.setState({ customerName: event.target.value });
                    }}
                  />
                    <InputGroup.Append>
                      <InputGroup.Text style={{background: '#fff', borderTopRightRadius: 22.5, borderBottomRightRadius: 22.5}}>
                        <FontAwesomeIcon icon='search' style={{opacity: 0.2}} onClick={this.searchQuery} />
                      </InputGroup.Text>
                    </InputGroup.Append>
              </InputGroup>
              </div>
              </div>

              <div
                style={{
                  display: "flex",
                  margin: "20px auto"
                }}
              >
                <div>
                  <DropdownButton title="Recent Customers" className='plain' variant='secondary'>
                    <Dropdown.Item href="#/action-1">
                      Recent Customers
                  </Dropdown.Item>
                    <Dropdown.Item href="#/action-2">
                      Pages Purchased
                  </Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Highest Value</Dropdown.Item>
                    <Dropdown.Item href="#/action-4">Sort Criteria</Dropdown.Item>
                  </DropdownButton>
                </div>
              </div>

              {/* List pages in table format */}
              <div style={{ display: "flex", flex: 1, justifyContent: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", width: '100%' }}>
                  {this.state.customers.map((page, i) => (
                    <NavLink
                      to={`/pages/${page.id}`}
                      style={{ color: "initial" }}
                    >
                      <div key={i} className="page" style={{ display: "flex", padding: 18, margin: '7.5px auto', alignItems: 'center', width: 'initial' }}>
                        <img
                          src={`https://s3-us-west-1.amazonaws.com/${
                            this.state.S3_BUCKET
                            }/${page.imageLink}`}
                          style={{
                            minWidth: 75, maxWidth: 75, height: 75, marginRight: 10, borderRadius: '50%', objectFit: 'cover'
                          }}
                        />
                        <div style={{ width: "100%" }}>
                          <p>{page.name}</p>
                          <p style={{ fontSize: 18 }}>
                            {page.firstName} {page.lastName}
                          </p>
                          <p style={{ color: '#88898c' }}>Item: Manatee Grooming</p>

                          <p style={{ alignItems: "left" }}>
                            <span style={{ fontSize: 14 }}>Status: </span>
                            <span style={{ fontSize: 14, color: "green" }}>
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
