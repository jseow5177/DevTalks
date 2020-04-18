import React, { useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import FormRow from '../auth/FormRow';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import InfoIcon from '@material-ui/icons/Info';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';

function AddChannel({ socket, showAddChannel, setShowAddChannel, setJoinedChannels }) {

    const [isSuccess, setIsSuccess] = useState(false); // Check if add channel is success
    const [isFailure, setIsFailure] = useState(false); // Check if add channel has failed
    const [channelInfo, setChannelInfo] = useState({
        channelName: "",
        channelDescription: ""
    });

    const handleChange = (event) => {
        setChannelInfo({...channelInfo, [event.target.id]: event.target.value});
    }

    const handleCreateChannel = (event) => {

        event.preventDefault();

        const channelData = { channelId: uuidv4(), ...channelInfo };

        // ---->> Save channel to DB <<---- //
        axios.post('http://localhost:5000/dev-talks/channels/add', channelData).then(res => {    
            const channels = res.data;       
            setIsSuccess(true);
            setJoinedChannels(channels);
        }).catch(err => {
            setIsFailure(true);
        });

        // Close alert after 3 seconds 
        setTimeout(() => {
            setIsSuccess(false);
            setIsFailure(false);
        }, 3000);

        // Close and reset form
        setShowAddChannel(false);
        setChannelInfo({
            channelName: "",
            channelDescription: ""
        });

    };

    // When add channel form is closed
    const handleCloseForm = () => {
        setShowAddChannel(false)
        setChannelInfo({
            channelName: "",
            channelDescription: ""
        });
    };

    // When alert after POST request is closed
    const handleCloseAlert = () => {
        setIsSuccess(false);
        setIsFailure(false);
    }

    return (
        <div>
            <div className="alert-message-wrapper">
                {isSuccess ? <Alert variant="success" onClose={handleCloseAlert} dismissible>Channel created!</Alert> : null}
                {isFailure ? <Alert variant="danger" onClose={handleCloseAlert} dismissible>Oops. Please try again!</Alert> : null}
            </div>
            <Modal className="add-channel-wrapper" show={showAddChannel} onHide={handleCloseForm} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add a channel</Modal.Title>
                </Modal.Header>
                <Form>
                    <FormRow
                        id="channelName"
                        placeholder="Channel name"
                        type="text"
                        icon={<FolderOpenIcon />}
                        value={channelInfo.channelName}
                        handleChange={handleChange}
                    />
                    <FormRow
                        id="channelDescription"
                        placeholder="Description"
                        type="text"
                        icon={<InfoIcon />}
                        value={channelInfo.channelDescription}
                        handleChange={handleChange}
                    />
                </Form>
                <Modal.Footer>
                    <Button variant="outline-success" onClick={handleCreateChannel}>Create</Button>
                    <Button className="cancel-btn" variant="outline-danger" onClick={handleCloseForm}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

const mapStateToPros = (state) => ({
    socket: state.socket
});

export default connect(mapStateToPros, null)(AddChannel);