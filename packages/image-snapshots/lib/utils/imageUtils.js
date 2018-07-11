"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pngjs_1 = require("pngjs");
exports.fillSizeDifference = (width, height) => (image) => {
    const inArea = (x, y) => y > height || x > width;
    for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
            if (inArea(x, y)) {
                const idx = ((image.width * y) + x) << 2;
                image.data[idx] = 0;
                image.data[idx + 1] = 0;
                image.data[idx + 2] = 0;
                image.data[idx + 3] = 64;
            }
        }
    }
    return image;
};
exports.createImageResizer = (width, height) => (source) => {
    const resized = new pngjs_1.PNG({ width, height, fill: true });
    pngjs_1.PNG.bitblt(source, resized, 0, 0, source.width, source.height, 0, 0);
    return resized;
};
exports.alignImagesToSameSize = (firstImage, secondImage) => {
    // Keep original sizes to fill extended area later
    const firstImageWidth = firstImage.width;
    const firstImageHeight = firstImage.height;
    const secondImageWidth = secondImage.width;
    const secondImageHeight = secondImage.height;
    // Calculate biggest common values
    const resizeToSameSize = exports.createImageResizer(Math.max(firstImageWidth, secondImageWidth), Math.max(firstImageHeight, secondImageHeight));
    // Resize both images
    const resizedFirst = resizeToSameSize(firstImage);
    const resizedSecond = resizeToSameSize(secondImage);
    // Fill resized area with black transparent pixels
    return [
        exports.fillSizeDifference(firstImageWidth, firstImageHeight)(resizedFirst),
        exports.fillSizeDifference(secondImageWidth, secondImageHeight)(resizedSecond)
    ];
};
exports.diffImages = (baseImage, compareImage) => {
    console.log(baseImage, compareImage);
};
//# sourceMappingURL=imageUtils.js.map