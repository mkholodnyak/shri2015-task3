let Backbone = require('Backbone');

let VizualizationPaneView = Backbone.View.extend({
    events: {
        'click i.icon-album': function() {
          this.$el.find('input').click();
        }
    }
});

module.exports = VizualizationPaneView;