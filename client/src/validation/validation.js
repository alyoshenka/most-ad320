function checkForUrl(input) {
    const re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
    return re.test(input) ? null : 'invalid url'
}

function checkForEmptyString(input) {
    return input === '' ? 'empty field' : null
}

function checkForAllWhitespace(input) {
    return input.trim() === '' ? 'only whitespace' : null
}

export default function(fieldName, fieldValue) {
    const emptyString = checkForEmptyString(fieldValue)
    if (emptyString) return emptyString

    const allWhiteSpace = checkForAllWhitespace(fieldName)
    if (allWhiteSpace) return allWhiteSpace

    const notUrl = checkForUrl(fieldValue)
    if (fieldName.endsWith('Image') && notUrl) return notUrl

    return null
}