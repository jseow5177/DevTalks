import React from 'react';

import SideBarNav from './SideBarNav'

function SideBarSection({ setShow, show, sectionTitle, items, type, placeholder }) {

    const toggleShow = () => {
        setShow(!show);
    }

    return (
        <div>
            <div className='sidebar-section'>
                <h5 className='sidebar-dropdown' onClick={toggleShow}>
                    <i className={'icon fas fa-caret-right ' + (show ? 'open' : null)}></i> {sectionTitle}
                </h5>
                <div className='sidebar-link-wrapper'>
                    {
                        show 
                        ? items.length !== 0
                            ? items.map(item => <SideBarNav type={type} key={type === 'channel' ? item.channelId : item.userId} item={item} />)
                            : <h6 className='sidebar-link'>(No {placeholder} found)</h6>
                        : null
                    }
                </div>
            </div>
        </div>
    )
}

export default SideBarSection;