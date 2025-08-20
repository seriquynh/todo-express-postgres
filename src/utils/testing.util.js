exports.hasErrorOnField = (errors, field) => {
    for (let error of errors) {
        if (error.field === field) {
            return true;
        }
    }

    return false;
}

exports.extractErrorMessages = (errors, field) => {
    const messages = [];
    for (let error of errors) {
        if (error.field === field) {
            messages.push(error.message);
        }
    }
    return messages;
}
