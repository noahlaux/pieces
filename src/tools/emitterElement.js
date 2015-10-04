(function (namespace) {

    function EmitterElement (element, options) {

        /**
         * Reference to element
         * @type {HTML element}
         */
        this.element = element;

        /**
         * Emitter bound to element
         * @type {Emitter}
         */
        this.emitter = new namespace.Emitter(options);

        // Set initial position
        this.setPosition(this.getPosition(this.element));

         // When element position changes, change position on emitter
        this.observeElement(this.element, function () {
            this.setPosition(this.getPosition(this.element));
        }.bind(this));
    }

    EmitterElement.prototype = {
        /**
         * Observes element on changes
         * @param  {HTML element}   element
         * @param  {Function} callback
         * @return N/A
         */
        observeElement: function (element, callback) {
            var observer = new MutationObserver(callback);
            observer.observe(element, { attributes: true, characterData: true });
        },

        /**
         * Get position of attached element
         * @param  {HTML element} element
         * @return {Object} { top: Number, left: Number }
         */
        getPosition: function (element) {

            var bodyRect = document.body.getBoundingClientRect();
            var elemRect = element.getBoundingClientRect();
            var offset = elemRect.top - bodyRect.top;

            return {
                top: elemRect.top - bodyRect.top,
                left: elemRect.left - bodyRect.left
            };
        },

        /**
         * Sets position of emitter
         * @param {Object} position @example { top: 0, left: 0 }
         */
        setPosition: function (position) {
            this.emitter.settings.positionX = position.left;
            this.emitter.settings.positionY = position.top;
        }
    };

    namespace.EmitterElement = EmitterElement;

})(window.pieces || {});
