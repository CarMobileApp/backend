const cls = require('cls-hooked');

const nsid = 'CARWASHAUTOMATION';

function middleware(req, res, next) {
	const ns = cls.getNamespace(nsid) || cls.createNamespace(nsid);
	ns.run(() => next());
}

function get(key) {
	const ns = cls.getNamespace(nsid);
	if (ns && ns.active) {
		return ns.get(key);
	}
}

function set(key, value) {
	const ns = cls.getNamespace(nsid);
	if (ns && ns.active) {
		return ns.set(key, value);
	}
}

module.exports = {
	middleware,
	get: get,
	set: set
}
