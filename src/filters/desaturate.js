(function (namespace) {
    namespace.filterFactory.register('desaturate', function (buffer, options) {

        var context = buffer.getContext('2d'),
            imageData = context.getImageData(0, 0, buffer.width, buffer.height),
            data = imageData.data,
            len = imageData.width * imageData.height * 4,
            index = 0,
            average;

        while (index < len) {
            average = (data[index] + data[index + 1] + data[index + 2]) / 3;
            data[index]     = average;
            data[index + 1] = average;
            data[index + 2] = average;
            index += 4;
        }

        context.putImageData(imageData, 0, 0);

        return buffer;
    });
})(window.pieces || {});
