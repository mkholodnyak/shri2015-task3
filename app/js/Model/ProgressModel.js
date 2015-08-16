var Backbone = require('Backbone');

let ProgressModel = Backbone.Model.extend({
    defaults: {
        value: 0
    },

    initialize: function() {
        this.listenTo(Backbone, 'player:player:progress', function (progress) {
           this.set('value', +progress);
        }.bind(this));
    }
});

module.exports = ProgressModel;