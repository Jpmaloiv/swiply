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
import Moment from "react-moment";
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
    if (name === 'name') {
      let arr = value.split(' ')
      this.state.user.firstName = arr[0]
      this.state.user.lastName = arr[1]
      return
    }
    this.state.user[name] = value;
    this.setState({ render: !this.state.render })
  };

  // Controls editing state
  handleEditing = e => {
    let name = e.currentTarget.getAttribute('name') + 'Edit'
    this.setState({ [name]: !this.state[name] });
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

    // Check if social media links were changed
    for (let i = 0; i < socialMedia.length; i++) {
      console.log(user[socialMedia[i]])
      if (user[socialMedia[i]]) query += `&${socialMedia[i]}=${user[socialMedia[i]]}`
      else query += `&${socialMedia[i]}=`
    }

    let data = new FormData();
    data.append("imgFile", this.state.file);

    axios.put("/api/users/update?id=" + user.id + '&firstName=' + user.firstName + '&lastName=' + user.lastName +
      '&title=' + user.title + "&profile=" + user.profile + query, data)
      .then(res => {
        console.log(res);
        window.location.reload();
      })
      .catch(err => {
        console.error(err);
      });

    if (this.state.sortedList) {
      console.log("HIIIII", this.state.sortedList)
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
                        background: "#01ae63",
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
                      placeholder={user.instagram}
                      name="instagram"
                      onChange={this.handleChange}
                    />
                    {user.instagram ?
                      <InputGroup.Append>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon='check' color='#00af63' />
                        </InputGroup.Text>
                      </InputGroup.Append>
                      : <span></span>}
                  </InputGroup><br />
                  <label>Facebook</label>
                  <InputGroup>
                    <FormControl
                      className='smInput'
                      style={user.facebook ? { borderRight: 'none' } : {}}
                      placeholder={user.facebook}
                      name="facebook"
                      onChange={this.handleChange}
                    />
                    {user.facebook ?
                      <InputGroup.Append>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon='check' color='#00af63' />
                        </InputGroup.Text>
                      </InputGroup.Append>
                      : <span></span>}
                  </InputGroup><br />
                  <label>Twitter</label>
                  <InputGroup>
                    <FormControl
                      className='smInput'
                      style={user.twitter ? { borderRight: 'none' } : {}}
                      placeholder={user.twitter}
                      name="twitter"
                      onChange={this.handleChange}
                    />
                    {user.twitter ?
                      <InputGroup.Append>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon='check' color='#00af63' />
                        </InputGroup.Text>
                      </InputGroup.Append>
                      : <span></span>}
                  </InputGroup><br />
                  <label>Linkedin</label>
                  <InputGroup>
                    <FormControl
                      className='smInput'
                      style={user.linkedIn ? { borderRight: 'none' } : {}}
                      placeholder={user.linkedIn}
                      name="linkedIn"
                      onChange={this.handleChange}
                    />
                    {user.linkedIn ?
                      <InputGroup.Append>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon='check' color='#00af63' />
                        </InputGroup.Text>
                      </InputGroup.Append>
                      : <span></span>}
                  </InputGroup><br />
                  <label>WhatsApp</label>
                  <InputGroup>
                    <FormControl
                      className='smInput'
                      style={user.whatsapp ? { borderRight: 'none' } : {}}
                      placeholder={user.whatsapp}
                      name="whatsapp"
                      onChange={this.handleChange}
                    />
                    {user.whatsapp ?
                      <InputGroup.Append>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon='check' color='#00af63' />
                        </InputGroup.Text>
                      </InputGroup.Append>
                      : <span></span>}
                  </InputGroup><br />
                  <label>Website (URL)</label>
                  <InputGroup>
                    <FormControl
                      className='smInput'
                      style={user.website ? { borderRight: 'none' } : {}}
                      placeholder={user.website}
                      name="website"
                      onChange={this.handleChange}
                    />
                    {user.website ?
                      <InputGroup.Append>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon='check' color='#00af63' />
                        </InputGroup.Text>
                      </InputGroup.Append>
                      : <span></span>}
                  </InputGroup><br />
                  <label>Email Address</label>
                  <InputGroup>
                    <FormControl
                      className='smInput'
                      placeholder={user.email}
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
                          opacity: 0.35,
                          filter: "blur(4px)",
                          objectFit: "cover"
                        }}
                        alt=""
                      />

                      <div className="textOverlay">
                        <div className="profilePic">
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
                        <br />
                        <div>
                          {this.state.nameEdit ?
                            <InputGroup>
                              <FormControl
                                placeholder={user.firstName + (user.lastName ? ' ' + user.lastName : '')}
                                name='name'
                                onChange={this.handleChange}
                                onBlur={this.handleEditing}
                                autoFocus
                              />
                            </InputGroup>
                            :
                            <div>
                              <h4 style={{ fontSize: 18, fontWeight: 'bold', margin: 0 }}>{user.firstName + (user.lastName ? ' ' + user.lastName : '')}
                                {this.state.nameEdit || this.state.titleEdit ?
                                  <span></span>
                                  :
                                  <FontAwesomeIcon icon='pen' size='sm' style={{ position: 'absolute', opacity: 0.3 }} onClick={() => this.setState({ nameEdit: true })} />
                                }</h4>
                            </div>
                          }
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
                              <p style={{ fontSize: 13, fontStyle: 'italic' }}>{user.title}
                                {this.state.nameEdit || this.state.titleEdit ?
                                  <span></span>
                                  :
                                  <FontAwesomeIcon icon='pen' size='xs' style={{ position: 'absolute', opacity: 0.3 }} onClick={() => this.setState({ titleEdit: true })} />
                                }</p>

                            </div>
                          }
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
      </ReactCSSTransitionGroup>
    );
  }
}
