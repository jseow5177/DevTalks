import React, { useState } from 'react';

import Login from './Login';
import Register from './Register';

function Landing() {

    const [show, setShow] = useState(false);

    const handleCloseRegister = () => setShow(false);
    const handleShowRegister = () => setShow(true);

    return (
        <div className='landing-wrapper'>
            <Login handleShowRegister={handleShowRegister} />
            <Register show={show} handleCloseRegister={handleCloseRegister} />
        </div>
    )
}

export default Landing;