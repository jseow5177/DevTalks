import React from 'react';

import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import FaceOutlinedIcon from '@material-ui/icons/FaceOutlined';

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

import ChannelInfoIcons from './ChannelInfoIcons';

function ChannelInfo({ channelId, channelName, channelDescription, owner, noOfMembers, userIsMember, setUserIsMember, starred, setStarred }) {

    return (
        <div className="channel-info-wrapper">
            <Accordion>
                <Card>
                    <Card.Header className="channel-info-title-wrapper">
                        <h4># {channelName}</h4>
                        {userIsMember ? <ChannelInfoIcons channelId={channelId} starred={starred} setStarred={setStarred} setUserIsMember={setUserIsMember} /> : null}
                        {noOfMembers > 1 ? `${noOfMembers} participants` : `${noOfMembers} participant`}
                    </Card.Header>

                    <Accordion.Toggle as={Card.Header} className="channel-info-toggle" eventKey='0'>
                        <InfoOutlinedIcon className="icon" />Description
                        </Accordion.Toggle>

                    <Accordion.Collapse eventKey="0">
                        <Card.Body>{channelDescription}</Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} className="channel-info-toggle" eventKey="1">
                        <FaceOutlinedIcon className="icon" />Created By
                        </Accordion.Toggle>

                    <Accordion.Collapse eventKey="1">
                        <Card.Body>{owner.username}</Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </div>
    )
}


export default ChannelInfo;