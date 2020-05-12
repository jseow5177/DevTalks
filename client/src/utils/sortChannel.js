const sortChannel = channelArray => {
    channelArray.sort((a, b) => (a.noOfMembers > b.noOfMembers) ? -1 : (a.noOfMembers === b.noOfMembers) ? ((a.stars > b.stars) ? -1 : 1) : 1);
    return channelArray;
}

export default sortChannel;