let _ = require('underscore'),
    Backbone = require('Backbone');

let PlayerModel = Backbone.Model.extend({
    defaults: {
        trackTitle: 'Track'
    },

    initialize: function () {
        this.listenTo(Backbone, 'player:upload-form:upload', this.handleTrack);
    },

    handleTrack: function (track) {
        if (track instanceof File) {
            this.set('trackTitle', track.name);
        }
    }
});

module.exports = PlayerModel;