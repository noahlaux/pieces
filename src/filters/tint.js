(function (namespace) {
    namespace.filterFactory.register('tint', function (buffer, options) {

        var ctx  = buffer.getContext("2d");
        var rgbks = this.generateRGBKs(buffer);

        var red = options.colors[0] || 0;
        var green = options.colors[1] || 0;
        var blue = options.colors[2] || 0;

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'copy';
        ctx.drawImage( rgbks[3], 0, 0 );

        ctx.globalCompositeOperation = 'lighter';
        if ( red > 0 ) {
            ctx.globalAlpha = red   / 255.0;
            ctx.drawImage( rgbks[0], 0, 0 );
        }
        if ( green > 0 ) {
            ctx.globalAlpha = green / 255.0;
            ctx.drawImage( rgbks[1], 0, 0 );
        }
        if ( blue > 0 ) {
            ctx.globalAlpha = blue   / 255.0;
            ctx.drawImage( rgbks[2], 0, 0 );
        }

        return buffer;
    });
})(window.pieces || {});

