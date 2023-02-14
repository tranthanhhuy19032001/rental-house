const siteRoute = require('./site');
const housesRoute = require('./houses');
const usersRoute = require('./users');
const meRoute = require('./me');

function route(app) {
    app.use('/me', meRoute);
    app.use('/user', usersRoute);
    app.use('/houses', housesRoute);
    app.use('/', siteRoute);
}

module.exports = route;
