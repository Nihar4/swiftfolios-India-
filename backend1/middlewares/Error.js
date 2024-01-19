const ErrorMiddleware = (err, req, res, next) => {
    console.log("in middleware", err)
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        error: true,
        message: err.message,
    });
};

module.exports = { ErrorMiddleware }
