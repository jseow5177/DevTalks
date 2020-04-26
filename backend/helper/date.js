const getDate = dateObject => {
    const day = (dateObject.getDate() < 10 ? '0' : '') + `${dateObject.getDate()}`;
    const month = ((dateObject.getMonth() + 1) < 10 ? '0' : '') + `${dateObject.getMonth() + 1}`;
    const year = dateObject.getFullYear();
    const date = `${day}/${month}/${year}`;
    return date;
}

module.exports = getDate;