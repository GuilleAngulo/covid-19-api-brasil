module.exports = {
    formatDate(date) {
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    },

    reverseDate(dateString) {
        return dateString.split('/').reverse().join('/');
    },

    matchDateInText(date) {
        const dateRegex = /\d{2}[-.\/]\d{2}(?:[-.\/]\d{2}(\d{2})?)?/g;
        const hourRegex =  /\d{2}:\d{2}/g;
        const dateString = date.match(dateRegex).toString().split('/').reverse().join('/');
        const timeString = date.match(hourRegex).toString();
        return new Date(timeString + ' ' + dateString);
    }
}