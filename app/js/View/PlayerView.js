let Backbone = require('Backbone');

let PlayerView = Backbone.View.extend({
    initialize: function (options) {
        options || (options = {});
        this.trackTitleSelector = options.trackTitleSelector || '';
        this.playButtonSelector = options.playButtonSelector || '';
        this.playButtonStateSelectors = options.playButtonStateSelectors || '';

        this.playButton = this.$el.find(this.playButtonSelector);
        this.trackTitle = this.$el.find(this.trackTitleSelector);

        this.initTrackTitle();
        this.initListeners();
    },

    events: {
        // TODO: убрать жесткую сцепку
        'click #js-play-button': 'handlePlayButtonClick'
    },

    initTrackTitle: function () {
        this.updateTrackTitle();
    },

    initListeners: function () {
        this.listenTo(this.model, 'change:trackTitle', this.updateTrackTitle);
        this.listenTo(this.model, 'change:playing', this.togglePlayButton);
        this.listenTo(Backbone, 'player:player:error', this.handleError);
    },

    updateTrackTitle: function () {
        var title = this.model.get('trackTitle');
        if (!title) {
            return;
        }
        this.setTrackTitle(title);
    },

    setTrackTitle: function (text, callback) {
        var truncateString = function(str, n) {
            return str.length>n ? str.substr(0,n-1) + '...' : str;
        };

        this.trackTitle.fadeOut(function () {
            this.trackTitle.text(truncateString(text, 40)).fadeIn();

            if (callback) {
                callback();
            }
        }.bind(this));
    },

    togglePlayButton: function () {
        var isPlaying = this.model.isPlaying();
        if (isPlaying) {
            this.playButton.removeClass(this.playButtonStateSelectors.play);
        } else {
            this.playButton.addClass(this.playButtonStateSelectors.play);
        }
    },

    handlePlayButtonClick: function () {
        this.model.toggle();
    },

    handleError: function (error) {
        this.setTrackTitle(error);
    }
});

module.exports = PlayerView;