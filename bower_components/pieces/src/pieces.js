(function () {

    window.pieces = {};

    var namespace = window.pieces;

    var requestAnimationFrame = window.requestAnimationFrame ||
                                window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame ||
                                window.msRequestAnimationFrame;

    window.requestAnimationFrame = requestAnimationFrame;

    /**
     * Holds particle render prototypes
     * @type {Object}
     */
    namespace.particleRenderFactory = {
        renderEngines: {},
        register: function (name, renderEngine) {
            this.renderEngines[name] = renderEngine;
        },

        /**
         * Get render engine prototype
         * @param  {String} name
         * @return {Function}
         */
        get: function (name) {
            return this.renderEngines[name];
        }
    };

    /**
     * Holds particle prototypes
     * @type {Object}
     */
    namespace.particleFactory = {
        particles: {},
        register: function (name, particle) {
            this.particles[name] = particle;
        },

        /**
         * Get particle prototype
         * @param  {String} name
         * @return {Function}
         */
        get: function (name) {
            return this.particles[name];
        }
    };

    /**
     * Filter factory
     * @type {Object}
     */
    namespace.filterFactory = {

        /**
         * Currently available filters
         * @type {Object}
         */
        filters: {},

        /**
         * Applies provided filters to an image
         * @param  {HTML element}   image to be filtered
         * @param  {Object}         filters filters with settings
         * @return {HTML element}   filtered image
         */
        applyFilters: function (image, filters) {

            var buffer = this.getImageBuffer(image.width, image.height);
            buffer.getContext('2d').drawImage(image, 0, 0);

            for (var filterName in filters) {
                var filter = this.get(filterName);
                if (filter) {
                    var options = filters[filterName];
                    buffer = filter.call(this, buffer, options);
                }
            }
            var newImage = new Image();
            newImage.src = buffer.toDataURL('image/png', 1);
            return newImage;
        },

        /**
         * Register a new filter
         * @param  {String} name        Name of the filter
         * @param  {Function} filter    filter function
         * @return N/A
         */
        register: function (name, filter) {
            this.filters[name] = filter;
        },

        /**
         * Get filter by name
         * @param  {String} name
         * @return {Function}
         */
        get: function (name) {
            return this.filters[name];
        },

        /**
         * Creates a canvas as a buffer
         * @param  {Number} width  Width of buffer
         * @param  {Number} height Height of buffer
         * @return {HTML element}
         */
        getImageBuffer: function (width, height) {
            var buffer = document.createElement('canvas');
            buffer.width = width;
            buffer.height = height;
            return buffer;
        },

        generateRGBKs: function (image) {
            var width = image.width;
            var height = image.height;
            var rgbks = [];

            var canvas = this.getImageBuffer(width, height);

            var ctx = canvas.getContext("2d");
            ctx.drawImage( image, 0, 0 );

            var pixels = ctx.getImageData( 0, 0, width, height ).data;

            // 4 is used to ask for 3 images: red, green, blue and
            // black in that order.
            for ( var rgbI = 0; rgbI < 4; rgbI++ ) {
                var buffer = this.getImageBuffer(width, height);

                var ctx = canvas.getContext('2d');
                ctx.drawImage( image, 0, 0 );
                var to = ctx.getImageData( 0, 0, width, height );
                var toData = to.data;

                for (
                        var i = 0, len = pixels.length;
                        i < len;
                        i += 4
                ) {
                    toData[i  ] = (rgbI === 0) ? pixels[i  ] : 0;
                    toData[i+1] = (rgbI === 1) ? pixels[i+1] : 0;
                    toData[i+2] = (rgbI === 2) ? pixels[i+2] : 0;
                    toData[i+3] =                pixels[i+3]    ;
                }

                ctx.putImageData( to, 0, 0 );

                // image is _slightly_ faster then canvas for this, so convert
                var imgComp = new Image();
                imgComp.src = canvas.toDataURL();

                rgbks.push( imgComp );
            }

            return rgbks;
        },
    };
})();
