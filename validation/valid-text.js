const validText = str => {
    return (typeof str === 'string') && (str.trim().length > 0);
}

// str.trim takes off all the spaces off the ends of the string
// in summary: makes sure it is a string, &&
// makes sure it is not an empty string, or a string that contains only spaces

module.exports = validText;