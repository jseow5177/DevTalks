import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import FormRow from './FormRow';
import { loginUser } from '../../actions/authActions';

import CodeIcon from '@material-ui/icons/Code';
import EmailIcon from '@material-ui/icons/Email';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

function Login({ handleShowRegister, errors, loginUser, auth }) {

    let history = useHistory();

    const [loginForm, setLoginForm] = useState({
        email: "",
        password: ""
    });
    const [formErrors, setFormErrors] = useState({});

    // Check if there are any form errors
    useEffect(() => {
        setFormErrors(errors);
    }, [errors]);

    // Check if user is authenticated
    useEffect(() => {

        if (auth.isAuthenticated) {
            history.push('/dev-talks');
        }
           
    }, [auth, history]);

    const handleChange = (event) => {
        setLoginForm({ ...loginForm, [event.target.id]: event.target.value });
    }

    const handleFormSubmit = () => {
        loginUser(loginForm);
    }

    return (
        <div>
            <Row>
                <Col xs={12}>
                    <div className="landing-title">
                        <h2 className="app-name"><CodeIcon className="logo" fontSize="large" />Dev Talks</h2>
                    </div>
                    <div className="landing-subtitle">
                        <h6>A chat space for developers</h6>
                    </div>
                    <Form className="landing-form">
                        <FormRow
                            id="email"
                            placeholder="Email"
                            type="email"
                            icon={<EmailIcon />}
                            value={loginForm.email}
                            handleChange={handleChange}
                            error={formErrors.emailNotFound || formErrors.email}
                        />
                        <FormRow
                            id="password"
                            placeholder="Password"
                            type="password"
                            icon={<VpnKeyIcon />}
                            value={loginForm.password}
                            handleChange={handleChange}
                            error={formErrors.passwordIncorrect || formErrors.password}
                        />
                        <Button variant="success" onClick={handleFormSubmit}>Login</Button>
                    </Form>
                </Col>
            </Row>
            <p className="register-or-login-text">Don't have an account? <button onClick={handleShowRegister} className="register-or-login-link">Register here</button>.</p>
        </div>

    )
}

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

const mapDispatchToProps = dispatch => {
    return {
        loginUser: (loginForm) => dispatch(loginUser(loginForm))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);