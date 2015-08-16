var Backbone = require('Backbone');

let ProgressView = Backbone.View.extend({
    initialize: function () {
        this.listenTo(this.model, 'change:value', this.update);
    },

    update: function () {
        var value = this.model.get('value');
        if (typeof value === 'number') {
            this.$el.attr('value', Math.floor(value * 100));
        }
    }
});

module.exports = ProgressView;