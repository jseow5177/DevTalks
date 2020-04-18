import React from 'react';
import { connect } from 'react-redux';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ChatBody from '../chat/ChatBody';
import ChatInput from '../chat/ChatInput';
import ChannelInfo from './ChannelInfo';
import EmptyState from './EmptyState';

function Body({ activeChannel }) {
    return (
        <div>
            {activeChannel.activeChannel ?
                <Row className="body-wrapper">
                    <Col xs={8}>
                        <ChatBody />
                        <ChatInput />
                    </Col>
                    <Col xs={4}>
                        <ChannelInfo />
                    </Col>
                </Row>
                : <div><EmptyState /></div>}
        </div>
    )
}

const mapStateToProps = state => ({
    activeChannel: state.activeChannel
})

export default connect(mapStateToProps, null)(Body);