const getDate = dateObject => {
    const day = (dateObject.getDay() < 10 ? '0' : '') + `${dateObject.getDay()}`;
    const month = ((dateObject.getMonth() + 1) < 10 ? '0' : '') + `${dateObject.getMonth() + 1}`;
    const year = dateObject.getFullYear();
    const date = `${day}/${month}/${year}`;
    return date;
}

module.exports = getDate;