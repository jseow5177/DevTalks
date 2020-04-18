import React from 'react';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';

function FormRow({id, placeholder, type, icon, value, handleChange}) {
    return (
        <div>
            <Form.Row>
                <Form.Group as={Col}>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>{icon}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control id={id} type={type} placeholder={placeholder} value={value} onChange={handleChange} autoComplete="off"/>
                    </InputGroup>
                </Form.Group>
            </Form.Row>
        </div>
    )
}

export default FormRow;