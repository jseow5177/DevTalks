import React, { useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { getActiveChannel } from '../../actions/channelActions';

import FormRow from '../main/FormRow';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import InfoIcon from '@material-ui/icons/Info';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';

function AddChannel({ showAddChannel, setShowAddChannel, setJoinedChannels, getActiveChannel, auth }) {

    const [isSuccess, setIsSuccess] = useState(false); // Check if add channel is success
    const [isFailure, setIsFailure] = useState(false); // Check if add channel has failed
    const [channelInfo, setChannelInfo] = useState({
        channelName: "",
        channelDescription: ""
    });

    const handleChange = (event) => {
        setChannelInfo({ ...channelInfo, [event.target.id]: event.target.value });
    }

    const handleCreateChannel = (event) => {

        event.preventDefault();

        const userData = {
            userId: auth.user.id,
            username: auth.user.username
        }

        const channelData = {
            channelId: uuidv4(),
            ...channelInfo,
            messages: [],
            owner: userData,
            members: [userData], // The first member is the owner
            noOfMembers: 1, // One new member
            stars: 0 // No stars
        }

        const data = {
            userData: userData,
            channelData: channelData
        };

        // ---->> Save channel to DB <<---- //
        axios.post('http://localhost:5000/dev-talks/channels/add', data).then(res => {
            const channels = res.data;
            setIsSuccess(true);
            setJoinedChannels(channels);
            getActiveChannel(channelData.channelId); // Immediately render the newly created channel
        }).catch(err => {
            console.log(err.response.data);
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
            <Modal className="modal-wrapper" show={showAddChannel} onHide={handleCloseForm} centered>
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
    auth: state.auth
});


const mapDispatchToProps = (dispatch) => {
    return {
        getActiveChannel: (channelId) => dispatch(getActiveChannel(channelId))
    }
}

export default connect(mapStateToPros, mapDispatchToProps)(AddChannel);