const app = require('./app');
const Mongo = require('./utils/mongo');
const logger = require('./utils/log4js').getLogger('SERVER');

const server = app.listen(app.get('port'), () => {
    logger.info('server listening in port '+  app.get('port'));
});

const shutdown = async () => {
    logger.info('shutting down server...');
    await server.close();
};

server.on('close', async () => {
    logger.debug('Closing server');
    await Mongo.disconnect();
});

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
