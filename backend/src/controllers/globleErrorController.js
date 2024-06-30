//development error
const devErrors = (res, error) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stacktrace: error.stackt,
        error: error,
    });
};

//production error
const prodErrors = (res, error) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    } else {
        res.status(500).json({
            status: "error",
            message: "Something went wrong ! please try again later",
        });
    }
};

//globalError
export const globalError = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";

    if (process.env.NODE_ENV === "development") {
        devErrors(res, error);
    } else if (process.env.NODE_ENV === "production") {
        prodErrors(res, error);
    }
};
