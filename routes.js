var Route = require('./core/Route.js');
var View = require('./core/View.js');

/* --------- Start importing your controlers here ---------- */

var test = require('./controllers/test.controller.js');
var user = require('./controllers/user.controller.js');

/* --------- End importing your controlers here ---------- */

/* ------------ Begin defining your routes ---------------- */

Route.get('/', function() {
   return "Hello !"; 
});

Route.get('/usr/{uid}/posts/{pid}', function (connection, args) {
    View.render("report", connection, args);
});

Route.get('/test-controller', test.handleRequest);

Route.post('/usr/new', user.singup);

/* ------------ End defining your routes ----------------- */

// A default 404 GET route
Route.get('/404', function(connection) {
   View.render('404', connection); 
});

module.exports = Route;