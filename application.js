'use strict';
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const routes = require('./apis/baseApis');

function launch() {
    let app = express();

    app.enable('trust proxy');
    app.use(helmet());
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev'));
    app.use(express.json({
        limit: '1kb'
    }));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser(process.env.COOKIE_SECRET));
    app.use(compression());

    app.use('/', routes);

    app.listen(process.env.PORT, (err) => {
        if (err) {
            console.error("Error launching express:", err);
            process.exit(1);
        }

        console.info(`Launched Nautilus on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
        app.emit('application_launch');
    });
}

module.exports = {
    launch
};