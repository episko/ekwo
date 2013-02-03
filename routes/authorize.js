/*
 * Authentication
 */

module.exports = function(app, dropbox){

  app.get('/authorize', function (req, res) {
    dropbox.accesstoken(req.session.request_token, function(status, access_token){
      req.session.access_token = access_token;
      res.redirect('/dashboard');
    });
  });

}
