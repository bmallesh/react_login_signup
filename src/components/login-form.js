import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import {
     Container, Row, Col, FormGroup, Label, Input
} from 'reactstrap';
import axios from 'axios'
class LoginForm extends Component {
    constructor() {
        super()
        this.state = {
            username: '',
            password: '',
            redirectTo: null,
            usernameError: '',
            passwordError: '',
            formError: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)

    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    loginValidate() {
        let usernameError = '';
        let passwordError = '';
        let pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(this.state.username)) {
            usernameError = "Enter valid email"
        }
        if (this.state.password.length <= 6) {
            passwordError = "Password must be >6"
        }
        if (usernameError || passwordError) {
            this.setState({ usernameError, passwordError })
            return false;
        }else {
            this.setState({ usernameError: '', passwordError: '' })
        }

        return true;
    }

    handleSubmit(event) {
        event.preventDefault()
        const isValid = this.loginValidate()
        console.log('handleSubmit')
        if (isValid) {
            axios
                .post('/coinbase/api/login', {
                    username: this.state.username,
                    password: this.state.password
                })
                .then(response => {
                    console.log('login response: ')
                    console.log(response)
                    if (response.status === 200) {
                        // update App.js state
                        this.props.updateUser({
                            loggedIn: true,
                            username: response.data.username
                        })
                        // update the state to redirect to home
                        this.setState({
                            redirectTo: '/'
                        })
                    }
                }).catch(error => {
                    console.log('login error: ')
                    console.log(error);
                    this.setState({
                        formError: "Invalid Email or Password"
                    })

                })
        }

    }

    render() {
        if (this.state.redirectTo) {
            return <Redirect to={{ pathname: this.state.redirectTo }} />
        } else {
            return (
                <Container>
                    <Row className="pt-5">
                        <Col><h4 className="pt-2 text-white">Sign in your account</h4></Col>
                    </Row>
                    <Row className="pt-3">
                        <Col sm="12" md="4"></Col>
                        <Col sm="12" md="4">
                            <div className="pt-4 rounded" style={{ color: "black", backgroundColor: "white" }}>
                                <form className="form-horizontal">
                                    <FormGroup className="mx-4">
                                        <Input
                                            className="form-input"
                                            type="text"
                                            id="username"
                                            name="username"
                                            placeholder="Email"
                                            value={this.state.username}
                                            onChange={this.handleChange}
                                        />
                                    </FormGroup>
                                    <div style={{ fontSize: 12, color: "red" }}>{this.state.formError}</div>
                                    <div style={{ fontSize: 12, color: "red" }}>{this.state.usernameError}</div>
                                    <FormGroup className="mx-4">
                                        <Input
                                            className="form-input"
                                            placeholder="password"
                                            type="password"
                                            name="password"
                                            value={this.state.password}
                                            onChange={this.handleChange}
                                        />
                                    </FormGroup>
                                    <div style={{ fontSize: 12, color: "red" }}>{this.state.passwordError}</div>
                                    <div className="form-group text-center">
                                        <button
                                            className="button mr-auto col-3 col-mr-auto"
                                            onClick={this.handleSubmit}
                                            type="submit">Login</button>
                                    </div>
                                    <p> <Link to="/forgot" className="btn btn-link text-center">
                                        <span className="">Forgot Password?</span>
                                    </Link></p>
                                </form>
                            </div>

                        </Col>
                        <Col sm="12" md="4"></Col>
                    </Row>
                </Container>
            )
        }
    }
}

export default LoginForm
