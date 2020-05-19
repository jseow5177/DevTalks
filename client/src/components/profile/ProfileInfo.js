import React, { useState } from 'react';

import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import ImageHolder from './ImageHolder';

function ProfileInfo({ profileStatus, username, bio, unfriend }) {

    // Show user profile image
    const [show, setShow] = useState(false);

    const showImage = () => {
        setShow(true);
    }

    return (
        <div>
            <div className='info-wrapper'>
                <Accordion>
                    <Card>
                        <Card.Header className='profile-info-title-wrapper'>
                            <div className='username'>
                                <Image src={`${process.env.PUBLIC_URL}/social-media.png`} className='profile-info-image' onClick={showImage} roundedCircle />
                                <h4>{username}</h4>
                            </div>
                            {
                                profileStatus === 'friend'
                                    ? (<div className='info-icons-wrapper'>
                                        <OverlayTrigger placement='top' overlay={<Tooltip>Unfriend</Tooltip>}>
                                            <button className='unfriend-btn' onClick={unfriend}><i className="fas fa-user-slash"></i></button>
                                        </OverlayTrigger>
                                    </div>)
                                    : null
                            }
                        </Card.Header>

                        <Accordion.Toggle as={Card.Header} className='channel-info-toggle' eventKey='0'>
                            <InfoOutlinedIcon className="icon" />Bio
                    </Accordion.Toggle>

                        <Accordion.Collapse eventKey="0">
                            <Card.Body>{bio ? bio : <span className='empty-bio'>(Empty)</span>}</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </div>
            <ImageHolder show={show} setShow={setShow} />
        </div>
    )
}


export default ProfileInfo;