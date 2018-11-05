import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import {
	Container, Row, Col, FormGroup, Input, Alert
} from 'reactstrap';
class Signup extends Component {
	constructor() {
		super()
		this.state = {
			firstname: '',
			lastname: '',
			username: '',
			password: '',
			redirectTo: '',
			firstnameError: '',
			lastnameError: '',
			usernameError: '',
			password: '',
			existUserError: '',
			alertMsg: null

		}
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}
	handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		})
	}


	registerValidate() {
		let firstnameError = '';
		let lastnameError = '';
		let usernameError = '';
		let passwordError = '';
		if (!this.state.firstname) {
			firstnameError = "Firstname cannot be blank";
		}
		if (!this.state.lastname) {
			lastnameError = "Lastname cannot be blank";
		}
		let pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
		if (!pattern.test(this.state.username)) {

			usernameError = "Enter valid Email"
		}
		if (this.state.password.length <= 6) {
			passwordError = "Passord must be >=6";

		}

		if (firstnameError || lastnameError || usernameError || passwordError) {
			this.setState({ firstnameError, lastnameError, usernameError, passwordError })
			return false;
		}
		else {
			this.setState({ firstnameError: '', lastnameError: '', usernameError: '', passwordError: '' })
		}

		return true
	}

	handleSubmit(event) {
		console.log('sign-up handleSubmit, username: ')
		console.log(this.state.username)
		event.preventDefault()
		const valid = this.registerValidate();
		if (valid) {
			axios.post('/coinbase/api/register', {
				firstname: this.state.firstname,
				lastname: this.state.lastname,
				username: this.state.username,
				password: this.state.password
			})
				.then(response => {
					console.log(response)
					if (!response.data.error) {
						console.log('successful signup')
						console.log(response)
						this.setState({ //redirect to login page
							alertMsg: true
						})
						setTimeout(
							function () {
								this.setState({ redirectTo: '/login' });
							}
								.bind(this),
							1000
						);
					} else {
						this.setState({
							existUserError: "Email already taken"
						})
						console.log('Email already taken')
					}
				}).catch(error => {
					console.log('signup error: ')
					console.log(error)

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
									You have been successfuly Signedup.you will be redirected to login
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
						<Col><h4 className="pt-2 text-white">Sign up your account</h4></Col>
					</Row>
					<Row className="pt-3">
						<Col sm="12" md={{ size: 3, offset: 3 }}></Col>
						<Col sm="12" md={{ size: 6, offset: 3 }}>
							<div className="pt-4 rounded" style={{ color: "black", backgroundColor: "white" }}>
								<form className="form-horizontal">
									<Row>
										<Col md={6}>
											<FormGroup className="ml-4">
												<Input
													className="form-input"
													type="text"
													id="firstname"
													name="firstname"
													placeholder="Enter first Name"
													pattern="^[a-zA-Z ]*$"
													value={this.state.firstname}
													onChange={this.handleChange}
												/>
											</FormGroup>
											<div style={{ fontSize: 12, color: "red" }}>{this.state.firstnameError}</div>
										</Col>
										<Col md={6}>
											<FormGroup className="ml-1 mr-4">
												<Input
													className="form-input"
													type="text"
													id="lastname"
													name="lastname"
													placeholder="Enter Last Name"
													value={this.state.lastname}
													onChange={this.handleChange}
												/>
											</FormGroup>
											<div style={{ fontSize: 12, color: "red" }}>{this.state.lastnameError}</div>
										</Col>
									</Row>
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
									<div style={{ fontSize: 12, color: "red" }}>{this.state.usernameError}</div>
									<div style={{ fontSize: 12, color: "red" }}>{this.state.existUserError}</div>
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
									<div className="form-group ">
										<div className=""></div>
										<button
											className="button mr-auto col-4"
											onClick={this.handleSubmit}
											type="submit"
										>Sign up</button>
									</div>
								</form>
							</div>
						</Col>
						<Col sm="12" md={{ size: 3, offset: 3 }}></Col>
					</Row>
				</Container>
			)
		}
	}
}

export default Signup
