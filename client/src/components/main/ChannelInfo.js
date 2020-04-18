import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import FaceOutlinedIcon from '@material-ui/icons/FaceOutlined';
import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded';

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

function ChannelInfo({ activeChannel }) {

    const [selectedChannel, setSelectedChannel] = useState({});

    useEffect(() => {
        setSelectedChannel(activeChannel.activeChannel);
    }, [activeChannel]);

    return (
        <div className="channel-info-wrapper">
            { Object.keys(selectedChannel).length !== 0 ? 
            <Accordion>
                <Card>
                    <Card.Header className="channel-info-title-wrapper">
                        <h4># {selectedChannel.channelName} <StarBorderRoundedIcon fontSize="large" /></h4>
                        {selectedChannel.noOfMembers > 1 ? `${selectedChannel.noOfMembers} participants` : `${selectedChannel.noOfMembers} participant`} 
                    </Card.Header>

                    <Accordion.Toggle as={Card.Header} className="channel-info-toggle" eventKey='0'>
                        <InfoOutlinedIcon className="icon" />Description
                    </Accordion.Toggle>

                    <Accordion.Collapse eventKey="0">
                        <Card.Body>{selectedChannel.channelDescription}</Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} className="channel-info-toggle" eventKey="1">
                        <FaceOutlinedIcon className="icon" />Created By
                    </Accordion.Toggle>

                    <Accordion.Collapse eventKey="1">
                        <Card.Body>{selectedChannel.owner.username}</Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
            : null}
        </div>
    )
}

const mapStateToProps = state => ({
    activeChannel: state.activeChannel
})

export default connect(mapStateToProps, null)(ChannelInfo);