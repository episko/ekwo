$(document).ready(function() {

  Ekwo.Router = Backbone.Router.extend({

    routes: {
      "" : "index"
    },

    initialize: function() {
      this.playerView = new Ekwo.Views.Player({ model: Ekwo.player });
      this.$library = $('#library');
      this.libraryHeader = new Ekwo.Views.LibraryHeader();
      this.tracksView = new Ekwo.Views.Tracks({ collection: Ekwo.tracks });
    },

    index: function() {
      this.$library.prepend(this.libraryHeader.render().el);
      this.$library.find('.scroll').append(this.tracksView.render().el);
    }

  });

});
