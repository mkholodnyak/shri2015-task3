let Backbone = require('Backbone');

let UploadFormView = Backbone.View.extend({
    initialize: function (options) {
        options || (options = {});
        this.highlightClass = options.highlightClass || '';

        this.highlight = false;
    },

    events: {
        'change input': 'submitForm',
        'submit': 'uploadFile',
        'drop': 'uploadFile',
        'dragenter': 'highlightForm',
        'dragleave': 'highlightForm'
    },

    submitForm: function(e) {
        this.$el.submit();
        return false;
    },

    uploadFile: function (e) {
        var file = (e.type === 'submit') ? e.target[0].files[0] : e.originalEvent.dataTransfer.files[0];
        if (!file) {
            return;
        }
        Backbone.trigger('player:upload-form:upload', file);
        return false;
    },

    highlightForm: function () {
        this.el.classList.toggle(this.highlightClass);
        this.highlight = !this.highlight;
    }
});

module.exports = UploadFormView;