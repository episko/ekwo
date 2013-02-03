/*
 * Login
 */

module.exports = function(app, dropbox){

  app.get('/login', function (req, res) {
    dropbox.requesttoken(function(status, request_token){
      req.session.request_token = request_token
      res.render('login', {
        title: 'Ekwo',
        url: request_token.authorize_url + '&oauth_callback=' + app.get('url') + '/authorize'
      });
    });
  });

}
