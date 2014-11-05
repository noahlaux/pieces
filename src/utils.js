(function (namespace) {
    namespace.utils = {
        deepExtend: function (destination, source) {
            for (var property in source) {
                if (source[property] && source[property].constructor &&
                    source[property].constructor === Object) {
                    destination[property] = destination[property] || {};
                    arguments.callee(destination[property], source[property]);
                } else {
                    destination[property] = source[property];
                }
            }
            return destination;
        },
        isEmpty: function (obj) {
            return Object.keys(obj || {}).length === 0;
        },

        /**
         * Load asset
         * @param  {String}   src URL or Base64
         * @param  {Function} cb  fired when image is ready
         */
        loadAsset: function (src, cb) {
            var image = new Image();

            image.src = src;

            image.onload = function () {
                cb(image);
            };
        }
    };
})(window.pieces || {});
