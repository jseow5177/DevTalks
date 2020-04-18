import React, { useState, useEffect } from 'react';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

import Form from 'react-bootstrap/Form';

import CreateIcon from '@material-ui/icons/Create';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';

import FormRow from '../auth/FormRow';

function ChatInput() {

    const [message, setMessage] = useState('');
    const [isPickerVisible, setIsPickerVisible] = useState(false);

    const handleChangeMessage = (event) => {
        setMessage(event.target.value);
    }

    useEffect(() => {
        document.addEventListener('keydown', detectEscapeKey);

        return () => {
            document.removeEventListener('keydown', detectEscapeKey);
        };
    });

    const sendMessage = event => {
        event.preventDefault();
        alert(message);
    }

    const detectEscapeKey = event => {
        if (event.key === "Escape") {
            setIsPickerVisible(false);
        }
    }

    const showPicker = () => {
        setIsPickerVisible(!isPickerVisible);
    }

    const addEmoji = (emoji) => {
        setMessage(message + emoji.native);
        setIsPickerVisible(false);
        document.getElementById('message').focus();
    }

    return (
        <div>
            {isPickerVisible ?
            <div className='picker-wrapper'>
                <Picker 
                    showPreview={false} 
                    title='Pick your emoji…' 
                    emoji='point_up'
                    onClick={addEmoji}
                />
            </div> : null
            }
            <div className='chat-input-wrapper'>
                <Form onSubmit={sendMessage}>
                    <InsertEmoticonIcon className='insert-emoticon-icon' onClick={showPicker} />
                    <FormRow
                        id='message'
                        type='text'
                        placeholder='Type a message'
                        icon={<CreateIcon />}
                        value={message}
                        handleChange={handleChangeMessage}
                    />
                </Form>
            </div>
        </div>
    )
}

export default ChatInput;