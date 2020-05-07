import React from 'react';

import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';

function ImageHolder({ show, setShow }) {

    const closeImage = () => {
        setShow(false);
    }

    return (
        <div>
            <Modal show={show} onHide={closeImage} centered className='modal-wrapper user-info-wrapper'>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <div className='user-image-wrapper'>
                        <Image src={`${process.env.PUBLIC_URL}/social-media.png`} roundedCircle />
                    </div>    
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default ImageHolder;