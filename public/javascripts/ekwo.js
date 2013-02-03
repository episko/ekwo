var Ekwo = {

  Models:      {},
  Collections: {},
  Views:       {},

  init: function() {
    // Set player element for global access
    Ekwo.player = new Ekwo.Models.Player();

    // Inititialize default tracks
    Ekwo.tracks = new Ekwo.Collections.Tracks();
    Ekwo.tracks.fetch({
      add: true,
      success: function() {
        Ekwo.tracks.fetchAllID3();
      }
    });

    // Fire up router
    Ekwo.router = new Ekwo.Router();
    Backbone.history.start();
  }

};
