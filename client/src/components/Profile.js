import React, { Component } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      accessRed: "false",
      accessGreen: "false",
      errors: {},
    };

    this.showButton = this.showButton.bind(this);
  }

  componentDidMount() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);

    axios
      .post("/users/permissions", {
        role: decoded.role,
      })
      .then((res) => {
        this.setState({
          accessRed: res.data.accessRedButton,
          accessGreen: res.data.accessGreenButton,
        });
      });
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

  render() {
    return (
      <div className="container">
        <div className="col-sm-8 mx-auto">
          <h1>{this.showButton()}</h1>
        </div>
      </div>
    );
  }
}

export default Profile;
