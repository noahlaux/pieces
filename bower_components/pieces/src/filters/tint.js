(function (namespace) {
    namespace.filterFactory.register('tint', function (buffer, options) {
        var context = buffer.getContext('2d'),
            imageData = context.getImageData(0, 0, buffer.width, buffer.height),
            data = imageData.data,
            red = options.colors[0],
            blue = options.colors[1],
            green = options.colors[2],
            opacity = options.strength,
            iLen = data.length, i,
            tintR, tintG, tintB,
            r, g, b, alpha1;

        tintR = red * opacity;
        tintG = green * opacity;
        tintB = blue * opacity;

        alpha1 = 1 - opacity;

        for (i = 0; i < iLen; i+=4) {
            r = data[i];
            g = data[i + 1];
            b = data[i + 2];

            // alpha compositing
            data[i] = tintR + r * alpha1;
            data[i + 1] = tintG + g * alpha1;
            data[i + 2] = tintB + b * alpha1;
        }

        context.putImageData(imageData, 0, 0);

        return buffer;
    });
})(window.pieces || {});

