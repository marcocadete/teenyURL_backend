exports.internalServerError = (errors = []) => {
    const error = new Error("Internal Server Error");
    error.status = 500;
    error.errors = errors;
    return error;
};

exports.badRequest = (errors = []) => {
    const error = new Error("Bad Request");
    error.status = 400;
    error.errors = errors;
    return error;
};

exports.notFound = (errors = []) => {
    const error = new Error("Not Found");
    error.status = 404;
    error.errors = errors;
    return error;
};
