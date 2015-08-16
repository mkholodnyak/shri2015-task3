let Backbone = require('Backbone');

let PlayerView = Backbone.View.extend({
    initialize: function (options) {
        options || (options = {});
        this.trackTitleClass = options.trackTitleClass || '';

        this.initTrackTitle();
        this.initListeners();
    },

    initTrackTitle: function () {
        this.updateTrackTitle();
    },

    initListeners: function () {
        this.listenTo(this.model, 'change:trackTitle', this.updateTrackTitle);
    },

    updateTrackTitle: function () {
        var title = this.model.get('trackTitle');
        if (!title) {
            return;
        }
        if (!this.trackTitle) {
            this.trackTitle = this.$el.find(this.trackTitleClass);
        }
        this.trackTitle.text(title);
    }
});

module.exports = PlayerView;