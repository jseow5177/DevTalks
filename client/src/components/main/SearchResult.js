import React from 'react';

function SearchResult({ channelName, setShowChannelList, setSearchedChannel }) {

    const openChannelList = () => {
        setShowChannelList(true);
        setSearchedChannel(channelName);
    }

    return (
        <div>
            <div onClick={openChannelList} className="search-result-wrapper" >
                {channelName}
            </div>
        </div>

    )
}

export default SearchResult;