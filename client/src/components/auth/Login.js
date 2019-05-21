import React, { Component } from 'react'

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      error: ""
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const newSignIn = {
      email: this.state.email,
      password: this.state.password
    }
    console.log(newSignIn);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">Sign in to your DevConnector account</p>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input onChange={this.onChange} value={this.state.email} type="email" className="form-control form-control-lg" placeholder="Email Address" name="email" />
                </div>
                <div className="form-group">
                  <input onChange={this.onChange} value={this.state.password} type="password" className="form-control form-control-lg" placeholder="Password" name="password" />
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login;
