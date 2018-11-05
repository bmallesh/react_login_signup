import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Container, Row, Col, FormGroup, Input, Alert } from 'reactstrap';
import axios from 'axios'

class forgot extends Component {
    constructor() {
        super()
        this.state = {
            username: '',
            password: '',
            redirectTo: null,
            invalidEmailError: '',
            alertMsg: null,
            color: null
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }


    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    forgotpasswordValidate() {
        let usernameError = '';
        let pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(this.state.username)) {
            usernameError = "Enter valid Email"
        }
        if (usernameError) {
            this.setState({ usernameError })
            return false;
        }
        else {
            this.setState({ usernameError: '' })
        }
        return true;
    }

    handleSubmit(event) {
        event.preventDefault()
        console.log('handleSubmit')
        const isValid = this.forgotpasswordValidate()

        if (isValid) {
            axios
                .post('/coinbase/api/forgot', {
                    username: this.state.username,
                })
                .then(response => {
                    console.log('mail sended ')
                    console.log(response)
                    if (response.data.status == "success") {
                        this.setState({
                            alertMsg: true,
                            color: 'warning',
                        })
                        setTimeout(
                            () => {
                                this.setState({ redirectTo: '/login' });
                            },
                            6000
                        );
                    } else {
                        this.setState({
                            invalidEmailError: 'User does not exist'
                        })
                    }
                }).catch(error => {
                    console.log('email error: ')
                    console.log(error);

                })
        }
    }

    render() {
        if (this.state.redirectTo) {
            return <Redirect to={{ pathname: this.state.redirectTo }} />
        } else {
            if (this.state.alertMsg) {
                return (
                    <Container>
                        <Row>
                            <Col sm="12" md="4"></Col>
                            <Col sm="12" md="4">
                                <Alert color="primary">
                                    Please check your email we have sent you a reset password link.
                                </Alert>
                            </Col>
                            <Col sm="12" md="4"></Col>
                        </Row>
                    </Container>
                )
            }
            return (
                <Container>
                    <Row className="pt-5">
                        <Col><h4 className="pt-2 text-white">Forgot Your Password?</h4></Col>
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
                                            placeholder="Enter Email"
                                            value={this.state.username}
                                            onChange={this.handleChange}
                                        />
                                    </FormGroup>
                                    <div style={{ fontSize: 15, color: "red" }}>{this.state.usernameError}</div>
                                    <div style={{ fontSize: 15, color: "red" }}>{this.state.invalidEmailError}</div>
                                    <div className="form-group ">
                                        <button
                                            className="button"
                                            onClick={this.handleSubmit}
                                            type="submit">Reset Password</button>
                                    </div>
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

export default forgot
