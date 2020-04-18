import React, {useState} from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import FormRow from './FormRow';

import CodeIcon from '@material-ui/icons/Code';
import EmailIcon from '@material-ui/icons/Email';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

function Login({handleShowRegister}) {

    const [loginForm, setLoginForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (event) => {
        setLoginForm({...loginForm, [event.target.id]: event.target.value});
    }

    return (
        <div>
            <Row>
                <Col xs={12}>
                    <div className="landing-title">
                        <h2 className="app-name"><CodeIcon className="logo" fontSize="large"/>Dev Talks</h2>
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
                        />
                        <FormRow
                            id="password"
                            placeholder="Password" 
                            type="password" 
                            icon={<VpnKeyIcon />} 
                            value={loginForm.password} 
                            handleChange={handleChange} 
                        />
                        <Button variant="success">Login</Button> 
                    </Form>
                </Col>
            </Row>
            <p className="register-or-login-text">Don't have an account? <button onClick={handleShowRegister} className="register-or-login-link">Register here</button>.</p>
        </div>

    )
}

export default Login;