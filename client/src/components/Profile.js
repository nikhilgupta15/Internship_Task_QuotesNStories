import React, { Component } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      role: "",
      accessRed: "false",
      accessGreen: "false",
      users: [],
      errors: {},
    };

    this.showButton = this.showButton.bind(this);
    this.addPermission = this.addPermission.bind(this);
    this.renderButton = this.renderButton.bind(this);
  }

  componentDidMount() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    this.setState({
      role: decoded.role,
      accessRed: decoded.accessRedButton,
      accessGreen: decoded.accessGreenButton,
    });

    axios
      .get("/users/profile?role=" + decoded.role)
      .then((res) => {
        this.setState({
          users: res.data,
        });
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }

  showButton() {
    if (this.state.accessRed === true && this.state.accessGreen === true) {
      return (
        <div>
          <button className="btn btn-danger">Red Button</button>
          <button className="btn btn-success ml-5">Green Button</button>
        </div>
      );
    }
    if (this.state.accessRed === false && this.state.accessGreen === true) {
      return (
        <div>
          <button className="btn btn-success">Green Button</button>
        </div>
      );
    }
    if (this.state.accessRed === true && this.state.accessGreen === false) {
      return (
        <div>
          <button className="btn btn-danger">Red Button</button>
        </div>
      );
    }
  }

  addPermission(id) {
    axios
      .post("/users/permissions", {
        userid: id,
      })
      .then((res) => {
        console.log(res.data);
        alert("Permission Updated");
        window.location.reload();
      });
  }

  renderButton(aR, id) {
    if (aR === true) {
      return (
        <div>
          <button type="button" className="btn btn-warning" disabled>
            Already Permitted
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => this.addPermission(id)}
          >
            Add Permission
          </button>
        </div>
      );
    }
  }
  render() {
    return (
      <div className="container">
        <div className="col-sm-8 mx-auto">
          <h3 className="m-4 text-center">Welcome {this.state.role}</h3>
          <div className="ml-4">{this.showButton()}</div>
          <div>
            <div style={{ height: 50 }}></div>
            {this.state.users.map((user) => {
              return (
                <div className="row m-2">
                  <p className="col-sm">{user.email}</p>
                  <p className="col-sm">{user.role}</p>
                  {this.renderButton(user.accessR, user._id)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
