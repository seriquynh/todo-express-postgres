exports.transformValidationErrors = (errors) => {
    return {
        message: 'Validation failed',
        errors: errors.array().map(error => ({
            field: error.path,
            message: error.msg
        })),
    }
}
