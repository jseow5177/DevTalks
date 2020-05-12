export const getDate = dateObject => {
    const day = (dateObject.getDate() < 10 ? '0' : '') + `${dateObject.getDate()}`;
    const month = ((dateObject.getMonth() + 1) < 10 ? '0' : '') + `${dateObject.getMonth() + 1}`;
    const year = dateObject.getFullYear();
    const date = `${day}/${month}/${year}`;
    return date;
}

export const getTime = time => {
    const dateObject = new Date(time);
    const hour = (dateObject.getHours() < 10 ? '0' : '') + dateObject.getHours();
    const minute = (dateObject.getMinutes() < 10 ? '0' : '') + dateObject.getMinutes();
    return `${hour}:${minute}`
}
