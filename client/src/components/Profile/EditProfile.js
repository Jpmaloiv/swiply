import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import jwt_decode from "jwt-decode";
import React, { Component } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import { CopyToClipboard } from "react-copy-to-clipboard";
import DragSortableList from "react-drag-sortable";
import Moment from "react-moment";
import { NavLink } from "react-router-dom";

export default class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: "",
      pages: [],
      user: {
        firstName: "",
        lastName: "",
        Pages: [],
        profile: "",
        instagram: "",
        facebook: "",
        twitter: "",
        linkedin: "",
        whatsapp: "",
        website: ""
      },
      copied: false
    };
  }

  componentWillMount() {
    const loginToken = window.localStorage.getItem("token");
    let decoded = "";
    if (loginToken) decoded = jwt_decode(loginToken);

    // console.log(this.state.user.Pages, "pages");
    // const positions = window.localStorage.getItem("ids");
    // let listGrid = []
    // let pages = [];

    axios
      .get("/api/users/search?id=" + decoded.id)
      .then(resp => {
        this.setState({
          user: resp.data.response[0],
          s3Bucket: resp.data.bucket,
          baseUrl: resp.data.BASE_URL
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  // Handles user input
  handleChange = e => {
    this.state.user[e.target.name] = e.target.value;
  };

  updateUser() {
    const { user } = this.state;
    console.log(user);
    axios
      .put(
        "/api/users/update?id=" +
          user.id +
          "&profile=" +
          user.profile +
          "&instagram=" +
          user.instagram +
          "&facebook=" +
          user.facebook +
          "&twitter=" +
          user.twitter +
          "&linkedin=" +
          user.linkedin +
          "&whatsapp=" +
          user.whatsapp +
          "&website=" +
          user.website
      )
      .then(res => {
        console.log(res);
        window.location.reload();
      })
      .catch(err => {
        console.error(err);
      });
  }


  render() {
    const { baseUrl, user } = this.state;

    const onSort = function(sortedList, dropEvent) {
      console.log("sortedList", sortedList, dropEvent);
   }
    let listGrid = this.state.user.Pages.map((page, i) => {
      return {
        content: (
          <NavLink
            to={`/pages/${page.id}`}
            style={{ color: "initial", width: "100%" }}
            key={i}
          >
            <div
              className="page"
              style={{ display: "flex", width: "initial", margin: "5px 0" }}
            >
              <img
                src={`https://s3-us-west-1.amazonaws.com/${
                  this.state.s3Bucket
                }/${page.imageLink}`}
                style={{ width: 75, objectFit: "cover", marginRight: 20 }}
              />
              <div style={{ width: "100%", textAlign: "left" }}>
                <p>{page.name}</p>
                <p style={{ fontSize: 14, color: "#a4A5A8" }}>
                  Published: <Moment format="M.DD.YYYY" date={page.createdAt} />
                </p>
                <p style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>$38,250</span>
                  <span>5.5k Followers</span>
                  <span>+98%</span>
                </p>
              </div>
            </div>
          </NavLink>
        )
      };
    });
    {
      /* {this.state.user.Pages.map((page, i) =>
                                            <NavLink to={`/pages/${page.id}`} style={{ color: 'initial', width: '100%' }} key={i}>
                                                <div className='page' style={{ display: 'flex', width: 'initial', margin: '5px 0' }}>
                                                    <img src={`https://s3-us-west-1.amazonaws.com/${this.state.s3Bucket}/${page.imageLink}`} style={{ width: 75, objectFit: 'cover', marginRight: 20 }} />
                                                    <div style={{ width: '100%', textAlign: 'left' }}>
                                                        <p>{page.name}</p>
                                                        <p style={{ fontSize: 14, color: '#a4A5A8' }}>Published: <Moment format='M.DD.YYYY' date={page.createdAt} /></p>
                                                        <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <span>$38,250</span>
                                                            <span>5.5k Followers</span>
                                                            <span>+98%</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </NavLink>
                                        )} */
    }

    return (
      <ReactCSSTransitionGroup
        transitionName="fade"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnter={false}
        transitionLeave={false}
      >
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1 }}>
            <div className="center" style={{ textAlign: "left" }}>
              <h5 style={{ textAlign: "center" }}>My PV3 Link</h5>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>{baseUrl}/profile/</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder={user.profile || user.id}
                  style={{ borderRadius: 0 }}
                  name="profile"
                  onChange={this.handleChange}
                />
                <CopyToClipboard
                  text={`${baseUrl}/profile/${user.profile || user.id}`}
                  onCopy={() => this.setState({ copied: true })}
                  style={{ cursor: "pointer" }}
                >
                  <InputGroup.Append>
                    <InputGroup.Text
                      style={{
                        background: "#01ae63",
                        color: "#fff",
                        borderRadius: 30,
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0
                      }}
                    >
                      Copy
                    </InputGroup.Text>
                  </InputGroup.Append>
                </CopyToClipboard>
              </InputGroup>
              <br />
              <h3>Connect Your Social Media</h3>
              <p>Add links to your social media accounts below:</p>
              <label>Instagram</label>
              <InputGroup>
                <FormControl
                  placeholder={user.instagram}
                  name="instagram"
                  onChange={this.handleChange}
                />
              </InputGroup>
              <label>Facebook</label>
              <InputGroup>
                <FormControl
                  placeholder={user.facebook}
                  name="facebook"
                  onChange={this.handleChange}
                />
              </InputGroup>
              <label>Twitter</label>
              <InputGroup>
                <FormControl
                  placeholder={user.twitter}
                  name="twitter"
                  onChange={this.handleChange}
                />
              </InputGroup>
              <label>Linkedin</label>
              <InputGroup>
                <FormControl
                  placeholder={user.linkedin}
                  name="linkedin"
                  onChange={this.handleChange}
                />
              </InputGroup>
              <label>WhatsApp</label>
              <InputGroup>
                <FormControl
                  placeholder={user.whatsapp}
                  name="whatsapp"
                  onChange={this.handleChange}
                />
              </InputGroup>
              <label>Website (URL)</label>
              <InputGroup>
                <FormControl
                  placeholder={user.website}
                  name="website"
                  onChange={this.handleChange}
                />
              </InputGroup>
              <label>Email Address</label>
              <InputGroup>
                <FormControl
                  placeholder={user.email}
                  name="email"
                  onChange={this.handleChange}
                />
              </InputGroup>
            </div>

            <Button
              variant="success"
              size="lg"
              style={{ display: "block" }}
              onClick={this.updateUser.bind(this)}
            >
              Update Info
            </Button>
          </div>

          <div className="editProfile" style={{ flex: 1.5 }}>
            <div className="center">
              <div
                className="smartphone"
                style={{
                  overflow: "scroll",
                  boxShadow: "-5px 10px 35px 1px #333"
                }}
              >
                <div className="content">
                  <div
                    id="background"
                    className="imageBanner set"
                    style={{ height: 335 }}
                  >
                    <img
                      src={
                        user.Pages.length > 0
                          ? `https://s3-us-west-1.amazonaws.com/${
                              this.state.s3Bucket
                            }/${user.imageLink}`
                          : ""
                      }
                      style={{
                        width: "100%",
                        height: "100%",
                        opacity: 0.3,
                        filter: "blur(8px)",
                        objectFit: "cover"
                      }}
                      alt=""
                    />

                    <div className="textOverlay">
                      <div className="profilePic">
                        {user.imageLink ? (
                          <img
                            src={`https://s3-us-west-1.amazonaws.com/${
                              this.state.s3Bucket
                            }/${user.imageLink}`}
                            style={{
                              width: 75,
                              height: 75,
                              borderRadius: "50%",
                              objectFit: "cover"
                            }}
                            alt=""
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon="user-plus"
                            size="2x"
                            color="white"
                            style={{ opacity: 0.8, cursor: "initial" }}
                          />
                        )}
                      </div>
                      <br />
                      <div>
                        <h3>{user.firstName + " " + user.lastName}</h3>
                        <p>{user.title}</p>
                      </div>
                    </div>
                  </div>

                  {/* List pages in table format */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      margin: "15px 10px"
                    }}
                  >
                    {this.state.user.Pages.length > 0 ? (
                      <h6 style={{ textAlign: "left" }}>Pages</h6>
                    ) : (
                      <h6 style={{ margin: "0 auto" }}>No pages yet!</h6>
                    )}
                    <DragSortableList
                      items={listGrid}
                      onSort={this.onSort}
                    />

                    {/* {this.state.user.Pages.map((page, i) =>
                                            <NavLink to={`/pages/${page.id}`} style={{ color: 'initial', width: '100%' }} key={i}>
                                                <div className='page' style={{ display: 'flex', width: 'initial', margin: '5px 0' }}>
                                                    <img src={`https://s3-us-west-1.amazonaws.com/${this.state.s3Bucket}/${page.imageLink}`} style={{ width: 75, objectFit: 'cover', marginRight: 20 }} />
                                                    <div style={{ width: '100%', textAlign: 'left' }}>
                                                        <p>{page.name}</p>
                                                        <p style={{ fontSize: 14, color: '#a4A5A8' }}>Published: <Moment format='M.DD.YYYY' date={page.createdAt} /></p>
                                                        <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <span>$38,250</span>
                                                            <span>5.5k Followers</span>
                                                            <span>+98%</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </NavLink>
                                        )} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ReactCSSTransitionGroup>
    );
  }
}
