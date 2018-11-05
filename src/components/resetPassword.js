import React, { Component } from 'react'
import { Redirect} from 'react-router-dom'
import axios from 'axios'

import {
     Container, Row, Col, FormGroup, Input
   } from 'reactstrap';

class resetPassword extends Component {
    constructor() {
        super()
        this.state = {
            newpassword: '',
            redirectTo: null,
            uid: '',
            retypepassword: '',
            newpasswordError: '',
            retypepasswordError: ''

        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)

        this.state.uid = document.URL.split('?');
        this.state.uid = this.state.uid[1].split('=');
        this.state.uid = this.state.uid[1];
        //alert(this.state.uid)
    }

    passwordValidate() {
        let newpasswordError = '';
        let retypepasswordError = '';
        if (this.state.newpassword.length <= 6) {
            newpasswordError = "Passord must be >=6";

        }
        if (this.state.newpassword !== this.state.retypepassword) {
            retypepasswordError = "Passord and confirm password must be same";
        }
        if (newpasswordError || retypepasswordError) {
            this.setState({ newpasswordError, retypepasswordError })
            return false;
        }
        else {
            this.setState({ newpasswordError: '', retypepasswordError: '' })
        }

        return true;
    }


    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit(event) {
        event.preventDefault()
        console.log('handleSubmit')
        const isValid = this.passwordValidate()
        if (isValid) {
            axios
                .post('/coinbase/api/reset', {
                    newpassword: this.state.newpassword,
                    uid: this.state.uid
                })
                .then(response => {
                    console.log('reset password response: ')
                    console.log(response)
                    if (response.status === 200) {
                        // update App.js state
                        console.log("redirect to login")

                        // update the state to redirect to home
                        this.setState({
                            redirectTo: '/login'
                        })
                    }
                }).catch(error => {
                    console.log('reset password error: ')
                    console.log(error);

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
                        <Col><h4 className="pt-2 text-white">Reset Password</h4></Col>
                    </Row>
                    <Row className="pt-3">
                        <Col sm="12" md="4"></Col>
                        <Col sm="12" md="4">
                            <div className="pt-4 rounded" style={{ color: "black", backgroundColor: "white" }}>
                                <form className="form-horizontal">
                                    <FormGroup className="mx-4">
                                        <Input
                                            className="form-input"
                                            type="password"
                                            id="newpassword"
                                            name="newpassword"
                                            placeholder="Enter new password"
                                            value={this.state.newpassword}
                                            onChange={this.handleChange}
                                        />
                                    </FormGroup>
                                    <div style={{ fontSize: 12, color: "red" }}>{this.state.newpasswordError}</div>
                                    <FormGroup className="mx-4">
                                        <Input
                                        className="form-input"
                                        type="password"
                                        id="retypepassword"
                                        name="retypepassword"
                                        placeholder="Retype password"
                                        value={this.state.retypepassword}
                                        onChange={this.handleChange}
                                        />
                                    </FormGroup>
                                    <div style={{ fontSize: 12, color: "red" }}>{this.state.retypepasswordError}</div>
                                    <div className="form-group ">
                                        <button
                                            className="button col-3"
                                            onClick={this.handleSubmit}
                                        >submit</button>
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

export default resetPassword
