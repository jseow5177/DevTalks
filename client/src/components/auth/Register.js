import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormRow from './FormRow';
import { registerUser } from '../../actions/authActions';

import EmailIcon from '@material-ui/icons/Email';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import FaceIcon from '@material-ui/icons/Face';
import LockIcon from '@material-ui/icons/Lock';

function Register({ show, handleCloseRegister, errors, registerUser }) {

    const [registerForm, setRegisterForm] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: ""
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        setFormErrors(errors);
    }, [errors]);
 
    const handleChange = (event) => {
        setRegisterForm({ ...registerForm, [event.target.id]: event.target.value });
    }

    const handleFormSubmit = () => {
        registerUser(registerForm);
    }

    return (
        <div>
            <Modal className="register-form" show={show} onHide={handleCloseRegister} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Join our community!</Modal.Title>
                </Modal.Header>
                <Form className="landing-form" onSubmit={handleFormSubmit}>
                    <FormRow
                        id="email"
                        placeholder="Email"
                        type="email"
                        icon={<EmailIcon />}
                        value={registerForm.email}
                        handleChange={handleChange}
                        error={formErrors.email}
                    />
                    <FormRow
                        id="username"
                        placeholder="Username"
                        type="text"
                        icon={<FaceIcon />}
                        value={registerForm.username}
                        handleChange={handleChange}
                        error={formErrors.username}
                    />
                    <FormRow
                        id="password"
                        placeholder="Password"
                        type="password"
                        icon={<VpnKeyIcon />}
                        value={registerForm.password}
                        handleChange={handleChange}
                        error={formErrors.password}
                    />
                    <FormRow
                        id="confirmPassword"
                        placeholder="Confirm password"
                        type="password"
                        icon={<LockIcon />}
                        value={registerForm.confirmPassword}
                        handleChange={handleChange}
                        error={formErrors.confirmPassword}
                    />
                </Form>
                <Modal.Footer>
                    <Button variant="success" onClick={handleFormSubmit}>Register</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

const mapStateToProps = state => ({
    errors: state.errors
});

const mapDispatchToProps = dispatch => {
    return {
        registerUser: (registerForm, history) => dispatch(registerUser(registerForm, history))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Register));