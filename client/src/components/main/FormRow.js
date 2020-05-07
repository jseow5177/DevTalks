import React from 'react';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';

function FormRow({id, placeholder, type, icon, value, handleChange, error}) {
    return (
        <div className="form-row-wrapper">
            <Form.Row>
                <Form.Group as={Col}>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>{icon}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control id={id} type={type} placeholder={placeholder} value={value} onChange={handleChange} autoComplete="off" />
                    </InputGroup>
                </Form.Group>
            </Form.Row>
            <p className="error-message">{error}</p>
        </div>
    )
}

export default FormRow;