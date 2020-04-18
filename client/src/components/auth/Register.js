import React, { useState } from 'react';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import FormRow from './FormRow';

import EmailIcon from '@material-ui/icons/Email';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import FaceIcon from '@material-ui/icons/Face';
import LockIcon from '@material-ui/icons/Lock';

function Register({ show, handleCloseRegister }) {

    const [registerForm, setRegisterForm] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (event) => {
        setRegisterForm({ ...registerForm, [event.target.id]: event.target.value });
    }

    return (
        <div>
            <Modal className="register-form" show={show} onHide={handleCloseRegister} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Join our community!</Modal.Title>
                </Modal.Header>
                <Form className="landing-form">
                    <FormRow
                        id="email"
                        placeholder="Email"
                        type="email"
                        icon={<EmailIcon />}
                        value={registerForm.email}
                        handleChange={handleChange}
                    />
                    <FormRow
                        id="username"
                        placeholder="Username"
                        type="text"
                        icon={<FaceIcon />}
                        value={registerForm.username}
                        handleChange={handleChange}
                    />
                    <FormRow
                        id="password"
                        placeholder="Password" 
                        type="password" 
                        icon={<VpnKeyIcon />} 
                        value={registerForm.password} 
                        handleChange={handleChange} 
                    />
                    <FormRow 
                        id="confirmPassword" 
                        placeholder="Confirm password" 
                        type="password" 
                        icon={<LockIcon />} 
                        value={registerForm.confirmPassword} 
                        handleChange={handleChange} 
                    />
                </Form>
                <Modal.Footer>
                    <Button variant="success">Register</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Register;