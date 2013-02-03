/*
 * Dashboard
 */

module.exports = function(app, dropbox){

  var path = require('path');

  app.get('/dashboard', function (req, res) {
    if (req.session.access_token) res.sendfile('public/dashboard.html');
    else res.redirect('/');
  });

}
