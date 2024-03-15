const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
const logger = require("./config/logger");

let server;

mongoose.connect(config.mongoose.url, {
    ...config.mongoose.options,
    useFindAndModify: false,
    useNewUrlParser: true, // Add this option
    useUnifiedTopology: true // Add this option
}).then(() => {
    logger.info("Connected to MongoDB");
    server = app.listen(config.port, () => {
        logger.info(`Listening on port ${config.port}`);
    });
}).catch((error) => {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info("Server closed");
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
};

const unexpectedErrorHandler = (error) => {
    logger.error("An unexpected error occurred:", error);
    exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
    logger.info("SIGTERM received");
    exitHandler();
});
