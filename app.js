const express = require('express');
const app = express();
const compression = require('compression');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const config = require('./config');
const cls = require('./utils/cls');
const routes = require('./routes');
const Mongo = require('./utils/mongo');
const logger = require('./utils/log4js').getLogger('APP');
const log4js = require('log4js');
const Errors = require('./errors');
const AppError = require('./errors/error');

app.set('port', config.API_PORT);
app.use(compression());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
app.use(helmet());

if (process.env.NODE_ENV !== 'PRODUCTION') {
	const cors = require('cors');
	const whiteList = [
		'http://localhost:3000'
	];
	const corsOptions = {
		origin: (something, cb) => {
			if (whiteList.indexOf(something) !== -1) {
				return cb(null, true);
			} else {
				return cb(new Error('invalid host'));
			}
		},
		credentials: true
	};
	app.use(cors(corsOptions));
}

process.on('uncaughtException', (err) => {
	logger.error(err.message);
	logger.error(err.stack);
	process.exit(1);
});

process.on('unhandledRejection', (err) => {
	logger.error(err.message);
	logger.error(err.stack);
	process.exit(1);
});

app.use(cls.middleware);
app.use(
	log4js.connectLogger(logger, {
		level: 'auto',
		format: `:remote-addr - ":method :url HTTP/:http-version" :status :content-length ":referrer" ":user-agent"`
	})
);

routes(app);

app.use((req, res, next) => {
	return next(Errors.notFound());
});

app.use((err, req, res, next) => {
	if (!err) {
		return next();
	}
	logger.error(err);
	if (!(err instanceof AppError)) {
		return res.status(500).send(err);
	}

	return res.status(err.statusCode).send({
		message: err.message,
		code: err.code
	});
});

const mongo = new Mongo();
mongo.connect();

module.exports = app;
