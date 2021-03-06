import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import jwt_decode from "jwt-decode";
import React, { Component } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import { CopyToClipboard } from "react-copy-to-clipboard";
import DragSortableList from "react-drag-sortable";
import { NotificationContainer, NotificationManager } from "react-notifications";
import { NavLink } from "react-router-dom";


export default class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: "",
      pages: [],
      sortedList: [],
      user: {
        firstName: "",
        lastName: "",
        Pages: [],
        profile: "",
      },
      socialMedia: ['instagram', 'facebook', 'twitter', 'linkedIn', 'whatsapp', 'website'],
      copied: false,
      nameEdit: false,
      titleEdit: false,
      width: 0,
      tabs: 'preview'
    };

    this.onSort = this.onSort.bind(this)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
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
        }, this.imageCheck);
      })
      .catch(error => {
        console.error(error);
      });
  }


  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth });
  }


  // Handles user input
  handleChange = e => {
    let { name, value } = e.target
    this.state.user[name] = value;
    this.setState({ render: !this.state.render })
  };

  // Controls editing state
  handleEditing = e => {
    let name = e.currentTarget.getAttribute('name') + 'Edit'
    this.setState({ [name]: !this.state[name] });
  }

  // Handles social media links
  handleLinks = e => {
    let name = e.target.alt
    if (name === 'instagram' || name === 'twitter') window.open(`http://www.${name}.com/${this.state.user[name].replace('@', '')}`)
    else window.open(this.state.user[name])
  }

  // Preview image once seleted
  onImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      this.state.user.imageLink = URL.createObjectURL(file);
      this.setState({
        file: file,
        fileName: file.name,
        fileType: file.type
      });
    }
  };

  imageCheck() {
    const { user } = this.state;
    if (user.imageLink) {
      user.imageLink = `https://s3-us-west-1.amazonaws.com/${
        this.state.s3Bucket
        }/${user.imageLink}`;
      this.setState({ render: !this.state.render });
    }
  }

  updateUser() {
    const { socialMedia, user } = this.state;
    let query = ''
    let email = user.email.trim();

    // Validates email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.invalidEmail.click()
      return
    }

    // Check if social media links were changed
    for (let i = 0; i < socialMedia.length; i++) {
      console.log(user[socialMedia[i]])
      if (user[socialMedia[i]]) query += `&${socialMedia[i]}=${user[socialMedia[i]]}`
      else query += `&${socialMedia[i]}=`
    }

    let data = new FormData();
    data.append("imgFile", this.state.file);

    axios.put("/api/users/update?id=" + user.id + '&email=' + email + '&title=' + user.title + "&profile=" + user.profile + '&summary=' + user.summary + query, data)
      .then(res => {
        console.log(res);
        window.location.reload();
      })
      .catch(err => {
        console.error(err);
      });

    if (this.state.sortedList) {
      for (var i = 0; i < this.state.sortedList.length; i++) {
        const { sortedList } = this.state
        axios.put(`/api/pages/update?id=${sortedList[i].key}&order=${sortedList[i].rank}`)
          .then(res => {
            console.log(res);
            // window.location.reload();
          })
          .catch(err => {
            console.error(err);
          });
      }
    }
  }

  createNotification = type => {
    return () => {
      switch (type) {
        case "invalidEmail":
          NotificationManager.error("Please try again", "Invalid email ", 2500);
          break;
      };
    };
  }

  onSort(sortedList) {
    console.log("sortedList", sortedList);
    // this.setState({ sorted: sortedList })
  }


  render() {

    const { baseUrl, tabs, user, width } = this.state;

    const onSort = function (sortedList, dropEvent) {
      console.log(sortedList)
      // for (var i = 0; i < sortedList.length; i++) {
      //   this.state.sortedList.push(sortedList.key)
      // }
      // this.setState({ sort: sortedList })

      console.log(this.state.sortedList)
    }

    let listGrid = this.state.user.Pages.map((page, i) => {
      return {
        content: (
          <NavLink
            to={`/pages/${page.id}`}
            style={{ color: "initial", fontWeight: 'bold', width: "100%" }}
            key={page.id}
          >
            <div
              className="page"
              style={{ display: "flex", padding: 7.5, width: "initial", margin: "10px 0", background: '#fff' }}
            >
              <img
                src={`https://s3-us-west-1.amazonaws.com/${
                  this.state.s3Bucket
                  }/${page.imageLink}`}
                style={{ height: 90, minWidth: 90, maxWidth: 90, objectFit: 'cover', borderRadius: 3 }}
              />
              <div style={{ width: "100%", textAlign: "left", display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', marginLeft: 20 }}>
                <p style={{ whiteSpace: 'nowrap' }}>{page.name}</p>
                <p className='previewText'>
                  {page.summary}
                </p>
              </div>
            </div>
          </NavLink>
        )
      };
    });


    return (
      <ReactCSSTransitionGroup
        transitionName="fade"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnter={false}
        transitionLeave={false}
      >
        <div className='public-profile'>
          <div style={{ flex: 1 }}>
            <div className="center" style={{ textAlign: "left" }}>
              <h5 style={{ textAlign: "center" }}>My Swiply Link</h5>
              <InputGroup className='profile-link' style={{ height: 55 }}>
                <InputGroup.Prepend>
                  <InputGroup.Text style={{ borderTopLeftRadius: 27.5, borderBottomLeftRadius: 27.5 }}>{baseUrl}/profile/</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder={user.profile}
                  style={{ height: 55, borderRadius: 0 }}
                  name="profile"
                  onChange={this.handleChange}
                />
                <CopyToClipboard
                  text={`${baseUrl}/profile/${user.profile}`}
                  onCopy={() => this.setState({ copied: true })}
                  style={{ cursor: "pointer" }}
                >
                  <InputGroup.Append>
                    <InputGroup.Text
                      style={{
                        background: "#5dcbb0",
                        color: "#fff",
                        borderTopRightRadius: 27.5,
                        borderBottomRightRadius: 27.5
                      }}
                    >
                      Copy
                    </InputGroup.Text>
                  </InputGroup.Append>
                </CopyToClipboard>
              </InputGroup>
            </div>
            <div>

              <ButtonGroup className='profile-tabs' style={{ width: "100%" }}>
                <Button
                  variant='link'
                  active={tabs === 'preview'}
                  onClick={() => this.setState({ tabs: 'preview' })}
                >
                  Preview
              </Button>
                <Button
                  variant='link'
                  active={tabs === 'settings'}
                  onClick={() => this.setState({ tabs: 'settings' })}
                >
                  Settings
                </Button>
              </ButtonGroup>
            </div>


            {tabs === 'settings' || width >= 767 ?
              <div className='center' style={{ textAlign: 'left' }}>
                <div className='smSettings'>
                  <br /><br />
                  <h3>Connect Your Social Media</h3>
                  <p>Add links to your social media accounts below:</p>
                  <br />
                  <label className='smLabel'>Instagram</label>
                  <InputGroup>
                    <FormControl
                      className='smInput'
                      style={user.instagram ? { borderRight: 'none' } : {}}
                      placeholder={user.instagram ? user.instagram : '@janedoe'}
                      value={user.instagram}
                      name="instagram"
                      onChange={this.handleChange}
                    />
                    {user.instagram ?
                      <InputGroup.Append>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon='check' color='#5dcbb0' />
                        </InputGroup.Text>
                      </InputGroup.Append>
                      : <span></span>}
                  </InputGroup><br />
                  <label>Facebook</label>
                  <InputGroup>
                    <FormControl
                      className='smInput'
                      style={user.facebook ? { borderRight: 'none' } : {}}
                      placeholder={user.facebook ? user.facebook : 'https://facebook.com/johndoe'}
                      value={user.facebook}
                      name="facebook"
                      onChange={this.handleChange}
                    />
                    {user.facebook ?
                      <InputGroup.Append>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon='check' color='#5dcbb0' />
                        </InputGroup.Text>
                      </InputGroup.Append>
                      : <span></span>}
                  </InputGroup><br />
                  <label>Twitter</label>
                  <InputGroup>
                    <FormControl
                      className='smInput'
                      style={user.twitter ? { borderRight: 'none' } : {}}
                      placeholder={user.twitter ? user.twitter : '@johnDoe'}
                      value={user.twitter}
                      name="twitter"
                      onChange={this.handleChange}
                    />
                    {user.twitter ?
                      <InputGroup.Append>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon='check' color='#5dcbb0' />
                        </InputGroup.Text>
                      </InputGroup.Append>
                      : <span></span>}
                  </InputGroup><br />
                  <label>Linkedin</label>
                  <InputGroup>
                    <FormControl
                      className='smInput'
                      style={user.linkedIn ? { borderRight: 'none' } : {}}
                      placeholder={user.linkedin ? user.linkedIn : 'https://linkedin.com/in/jane-doe-0291c837'}
                      value={user.linkedIn}
                      name="linkedIn"
                      onChange={this.handleChange}
                    />
                    {user.linkedIn ?
                      <InputGroup.Append>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon='check' color='#5dcbb0' />
                        </InputGroup.Text>
                      </InputGroup.Append>
                      : <span></span>}
                  </InputGroup><br />
                  <label>WhatsApp</label>
                  <InputGroup>
                    <FormControl
                      className='smInput'
                      style={user.whatsapp ? { borderRight: 'none' } : {}}
                      placeholder={user.whatsapp ? user.whatsapp : '+91 75671 04889'}
                      value={user.whatsapp}
                      name="whatsapp"
                      onChange={this.handleChange}
                    />
                    {user.whatsapp ?
                      <InputGroup.Append>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon='check' color='#5dcbb0' />
                        </InputGroup.Text>
                      </InputGroup.Append>
                      : <span></span>}
                  </InputGroup><br />
                  <label>Website (URL)</label>
                  <InputGroup>
                    <FormControl
                      className='smInput'
                      style={user.website ? { borderRight: 'none' } : {}}
                      placeholder={user.website ? user.website : 'https://google.com'}
                      value={user.website}
                      name="website"
                      onChange={this.handleChange}
                    />
                    {user.website ?
                      <InputGroup.Append>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon='check' color='#5dcbb0' />
                        </InputGroup.Text>
                      </InputGroup.Append>
                      : <span></span>}
                  </InputGroup><br />
                  <label>Email Address</label>
                  <InputGroup>
                    <FormControl
                      className='smInput'
                      placeholder={user.email}
                      value={user.email}
                      name="email"
                      onChange={this.handleChange}
                    />
                  </InputGroup>

                  <Button
                    variant="success"
                    size="lg"
                    style={{ display: "block" }}
                    onClick={this.updateUser.bind(this)}
                  >
                    Update Settings
                  </Button>

                </div>
              </div>
              :
              <span></span>
            }
          </div>

          {tabs === 'preview' || width >= 767 ?
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
                      style={{ height: 335, background: '#fff' }}
                    >
                      <img
                        src={
                          user.Pages.length > 0
                            ? user.imageLink
                            : ""
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                          opacity: 0.3,
                          filter: "blur(6px)",
                          objectFit: "cover"
                        }}
                        alt=""
                      />

                      <div className="textOverlay pp">
                        <div className="profilePic" style={{ marginBottom: 5 }}>
                          {user.imageLink ?
                            <div>
                              <img
                                src={user.imageLink}
                                style={{
                                  width: 75,
                                  height: 75,
                                  borderRadius: "50%",
                                  objectFit: "cover"
                                }}
                                alt=""
                              />
                              <FontAwesomeIcon
                                icon="user-plus"
                                style={{ opacity: 0.2, position: "absolute" }}
                                onClick={() => {
                                  this.upload.click();
                                }}
                              />
                            </div>
                            :
                            <FontAwesomeIcon
                              icon="user-plus"
                              size="2x"
                              color="white"
                              style={{ opacity: 0.8, cursor: "initial" }}
                            />
                          }
                        </div>

                        <div>

                          <div>
                            <h4 style={{ fontSize: 18, fontWeight: 'bold', margin: 0 }}>{user.firstName + (user.lastName ? ' ' + user.lastName : '')}</h4>
                          </div>

                          {this.state.titleEdit ?
                            <InputGroup>
                              <FormControl
                                placeholder={user.title}
                                name='title'
                                onChange={this.handleChange}
                                onBlur={this.handleEditing}
                                autoFocus
                              />
                            </InputGroup>
                            :
                            <div>
                              <p style={{ fontSize: 13, fontStyle: 'italic', marginBottom: 5 }}>{user.title}
                                {this.state.nameEdit || this.state.titleEdit || !this.state.user.title ?
                                  <span></span>
                                  :
                                  <FontAwesomeIcon icon='pen' size='xs' style={{ position: 'absolute', opacity: 0.3 }} onClick={() => this.setState({ titleEdit: true })} />
                                }</p>

                            </div>
                          }
                          {this.state.summaryEdit ?
                            <InputGroup style={{ maxWidth: '80%' }}>
                              <FormControl
                                as='textarea'
                                placeholder={user.summary}
                                style={{ fontSize: 12 }}
                                name='summary'
                                onChange={this.handleChange}
                                onBlur={this.handleEditing}
                                autoFocus
                              />
                            </InputGroup>
                            :
                            <div style={{ width: '80%', margin: '0 auto' }}>
                              <p className='previewText iii' onClick={() => this.setState({ summaryEdit: true })} style={{ marginBottom: 5, cursor: 'pointer' }}>{user.summary}</p>
                            </div>
                          }
                          <div className='social'>
                            {user.instagram ?
                              <img src={require(`../../images/instagram.png`)} alt='instagram' onClick={this.handleLinks} />
                              : <span></span>
                            }
                            {user.facebook ?
                              <img src={require(`../../images/facebook.png`)} alt='facebook' onClick={this.handleLinks} />
                              : <span></span>
                            }
                            {user.twitter ?
                              <img src={require(`../../images/twitter.png`)} alt='twitter' onClick={this.handleLinks} />
                              : <span></span>
                            }
                            {user.linkedIn ?
                              <img src={require(`../../images/linkedIn.png`)} alt='linkedIn' onClick={this.handleLinks} />
                              : <span></span>
                            }
                            {user.website ?
                              <div className='sm-icon' onClick={() => window.open(this.state.user.website)} style={{ cursor: 'pointer' }}>
                                <img src={require(`../../images/website.jpeg`)} alt='website' />
                              </div>
                              : <span></span>
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* List pages in table format */}
                    <div
                      style={{
                        margin: "15px 10px"
                      }}
                    >
                      {this.state.user.Pages.length > 0 ? (
                        <h6 style={{ textAlign: "left", fontWeight: 'bold' }}>Courses</h6>
                      ) : (
                          <h6 style={{ margin: "0 auto" }}>No pages yet!</h6>
                        )}
                      <DragSortableList
                        items={listGrid}
                        onSort={this.onSort.bind(this)}
                      />

                      <input
                        type="file"
                        name="imgFile"
                        ref={ref => (this.upload = ref)}
                        onChange={this.onImageChange}
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            :
            <span></span>
          }
        </div>

        <button
          className="btn btn-danger"
          onClick={this.createNotification("invalidEmail")}
          ref={ref => (this.invalidEmail = ref)}
          style={{ display: "none" }}
        >
          Error
        </button>

        <NotificationContainer />

      </ReactCSSTransitionGroup>
    );
  }
}
