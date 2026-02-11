module.exports = (...args) => import('./index.js').then(mod => mod.default(...args));
