const routes = require('next-routes')();

routes
    .add('/', '/index')
    .add('/admin', '/admin')
    .add('/coin/:coinId', '/coin/show')
    .add('/profile/:address', '/profile/show');

module.exports = routes;