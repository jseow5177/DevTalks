import React from 'react';

import Image from 'react-bootstrap/Image';

function EmptyState() {
    return (
        <div className="empty-state-wrapper">
            <Image src={`${process.env.PUBLIC_URL}/empty-state.png`} roundedCircle />
            <h2>Keep the conversation going</h2>
            <h3>Join or create a channel.</h3>
        </div>
    )
}

export default EmptyState;