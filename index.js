'use strict';
'use strict';
const cluster = require('cluster');

if (cluster.isMaster) {
    const CLUSTER_NUMBER = 1;
    console.info(`Master Cluster: Launching ${CLUSTER_NUMBER} workers`);

    for (let i = 0; i < CLUSTER_NUMBER; i++) {
        cluster.fork();
    }

    cluster.on('online', (worker) => {
        console.log(`Worker ${worker.id} is online with pid ${worker.process.pid}`);
    });

    cluster.on('exit', (worker, code, signal) => {
        console.error(`Worker ${worker.id} exitted with code: ${code} signal: ${signal}`);
    });

    cluster.on('disconnect', (worker) => {
        console.error(`Worker ${worker.id} disconnected. Launching replacement worker...`);
        cluster.fork();
    });
} else {
    require('dotenv').config();
    process.on('uncaughtException', (err) => {
        try {
            console.error("Uncaught Exception. Shutting down worker", err);
        } catch (err) {
            console.error("Uncaught Exception during worker shutdown:", err);
            process.exit(1);
        }
    });

    const application = require('./application');
    application.launch();
}